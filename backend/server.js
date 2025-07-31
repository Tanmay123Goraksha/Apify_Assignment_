const express = require('express');
const cors = require('cors');
const axios = require('axios');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Validate API key middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-apify-token'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  req.apiKey = apiKey;
  next();
};

// Get user's actors
app.get('/api/actors', validateApiKey, async (req, res) => {
  try {
    const response = await axios.get('https://api.apify.com/v2/acts', {
      headers: {
        'Authorization': `Bearer ${req.apiKey}`
      },
      params: {
        limit: 100,
        offset: 0
      }
    });

    const actors = response.data.data.items.map(actor => ({
      id: actor.id,
      name: actor.name,
      title: actor.title || actor.name,
      description: actor.description,
      username: actor.username,
      isPublic: actor.isPublic
    }));

    res.json({ actors });
  } catch (error) {
    console.error('Error fetching actors:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    res.status(500).json({ error: 'Failed to fetch actors' });
  }
});

// Get actor input schema
app.get('/api/actors/:actorId/schema', validateApiKey, async (req, res) => {
  try {
    const { actorId } = req.params;
    
    const response = await axios.get(`https://api.apify.com/v2/acts/${actorId}`, {
      headers: {
        'Authorization': `Bearer ${req.apiKey}`
      }
    });

    const actor = response.data.data;
    let inputSchema = {};

    // Try to get input schema from different possible locations
    if (actor.defaultRunOptions?.input) {
      inputSchema = actor.defaultRunOptions.input;
    } else if (actor.exampleRunInput) {
      inputSchema = actor.exampleRunInput;
    } else if (actor.inputSchema) {
      inputSchema = actor.inputSchema;
    }

    // If we have a JSON schema in the actor definition
    if (actor.versions && actor.versions.length > 0) {
      const latestVersion = actor.versions[0];
      if (latestVersion.inputSchema) {
        const schemaResponse = await axios.get(`https://api.apify.com/v2/acts/${actorId}/versions/${latestVersion.versionNumber}/input-schema`, {
          headers: {
            'Authorization': `Bearer ${req.apiKey}`
          }
        });
        inputSchema = schemaResponse.data;
      }
    }

    res.json({ 
      schema: inputSchema,
      actorInfo: {
        name: actor.name,
        title: actor.title || actor.name,
        description: actor.description
      }
    });
  } catch (error) {
    console.error('Error fetching actor schema:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key or unauthorized access' });
    }
    res.status(500).json({ error: 'Failed to fetch actor schema' });
  }
});

// Execute actor run
app.post('/api/actors/:actorId/run', validateApiKey, async (req, res) => {
  try {
    const { actorId } = req.params;
    const { input } = req.body;

    // Start the actor run
    const runResponse = await axios.post(`https://api.apify.com/v2/acts/${actorId}/runs`, 
      input || {},
      {
        headers: {
          'Authorization': `Bearer ${req.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          waitForFinish: 300 // Wait up to 5 minutes for completion
        }
      }
    );

    const run = runResponse.data.data;
    
    // If the run is still running, poll for completion
    let finalRun = run;
    if (run.status === 'RUNNING') {
      const maxPolls = 60; // Poll for up to 5 minutes (5s intervals)
      let polls = 0;
      
      while (finalRun.status === 'RUNNING' && polls < maxPolls) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const statusResponse = await axios.get(`https://api.apify.com/v2/acts/${actorId}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${req.apiKey}`
          }
        });
        
        finalRun = statusResponse.data.data;
        polls++;
      }
    }

    // Get the dataset items if the run succeeded
    let output = null;
    if (finalRun.status === 'SUCCEEDED' && finalRun.defaultDatasetId) {
      try {
        const datasetResponse = await axios.get(`https://api.apify.com/v2/datasets/${finalRun.defaultDatasetId}/items`, {
          headers: {
            'Authorization': `Bearer ${req.apiKey}`
          },
          params: {
            limit: 10 // Limit to first 10 items for display
          }
        });
        output = datasetResponse.data;
      } catch (datasetError) {
        console.error('Error fetching dataset:', datasetError.message);
        // Continue without dataset data
      }
    }

    res.json({
      runId: finalRun.id,
      status: finalRun.status,
      startedAt: finalRun.startedAt,
      finishedAt: finalRun.finishedAt,
      stats: finalRun.stats,
      output: output,
      errorMessage: finalRun.errorMessage
    });

  } catch (error) {
    console.error('Error executing actor run:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key or unauthorized access' });
    }
    if (error.response?.status === 400) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    res.status(500).json({ error: 'Failed to execute actor run' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});




app.listen(PORT, () => {
  console.log(`🚀 Apify Integration Server running on port ${PORT}`);
});