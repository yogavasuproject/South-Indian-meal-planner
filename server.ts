import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { 
  generateDailyMenuWithGemini, 
  swapMealSlotWithGemini, 
  chatWithGemini, 
  generateOrEditImageWithGemini, 
  startVeoVideoGeneration, 
  checkVeoVideoStatus, 
  getVeoVideoDownloadStream, 
  synthesizeVoiceAudio,
  getAI
} from './server/geminiService.ts';
import { Modality, LiveServerMessage } from '@google/genai';
import { generateWeeklyPlan } from './server/weeklyPlanner.ts';
import { CURATED_MENUS } from './src/services/southIndianDatabase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '20mb' }));

  // API Routes
  app.post('/api/generate-menu', async (req, res) => {
    try {
      const { preferences, overridePrompt, previousMenu } = req.body;
      const menu = await generateDailyMenuWithGemini(preferences, overridePrompt, previousMenu);
      res.json(menu);
    } catch (error: any) {
      console.error('Error generating menu:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate menu' });
    }
  });

  app.post('/api/swap-meal', async (req, res) => {
    try {
      const { mealType, currentMenu, preferences, customRequest } = req.body;
      const updatedMenu = await swapMealSlotWithGemini(mealType, currentMenu, preferences, customRequest);
      res.json(updatedMenu);
    } catch (error: any) {
      console.error('Error swapping meal:', error);
      res.status(500).json({ error: error?.message || 'Failed to swap meal' });
    }
  });

  app.post('/api/generate-weekly', async (req, res) => {
    try {
      const { preferences } = req.body;
      const weeklyPlan = await generateWeeklyPlan(preferences);
      res.json(weeklyPlan);
    } catch (error: any) {
      console.error('Error generating weekly plan:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate weekly plan' });
    }
  });

  // 1. GEMINI MULTI-TURN CHATBOT ROUTE
  // Models: gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, systemInstruction, modelName, menuContext } = req.body;
      const result = await chatWithGemini(messages, systemInstruction, modelName, menuContext);
      res.json(result);
    } catch (error: any) {
      console.error('Error in AI chat:', error);
      res.status(500).json({ error: error?.message || 'Chat request failed' });
    }
  });

  // 2. GEMINI IMAGE GENERATION & EDITING ROUTE
  // Model: gemini-3.1-flash-image-preview
  app.post('/api/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio, baseImage, mimeType } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      const result = await generateOrEditImageWithGemini(prompt, aspectRatio, baseImage, mimeType);
      res.json(result);
    } catch (error: any) {
      console.error('Error in image generation:', error);
      res.status(500).json({ error: error?.message || 'Image generation failed' });
    }
  });

  // 3. VEO VIDEO GENERATION (3-step pattern)
  // Model: veo-3.1-fast-generate-preview
  app.post('/api/generate-video', async (req, res) => {
    try {
      const { prompt, aspectRatio, imageBase64, mimeType } = req.body;
      const { operationName } = await startVeoVideoGeneration(prompt, aspectRatio, imageBase64, mimeType);
      res.json({ operationName });
    } catch (error: any) {
      console.error('Error starting Veo video:', error);
      res.status(500).json({ error: error?.message || 'Video generation failed' });
    }
  });

  app.post('/api/video-status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }
      const status = await checkVeoVideoStatus(operationName);
      res.json(status);
    } catch (error: any) {
      console.error('Error checking video status:', error);
      res.status(500).json({ error: error?.message || 'Status check failed' });
    }
  });

  app.post('/api/video-download', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }
      const { stream, contentType } = await getVeoVideoDownloadStream(operationName);
      res.setHeader('Content-Type', contentType);

      if (stream.pipe) {
        stream.pipe(res);
      } else {
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      }
    } catch (error: any) {
      console.error('Error downloading video:', error);
      res.status(500).json({ error: error?.message || 'Failed to download video stream' });
    }
  });

  // 4. VOICE SPEECH ASSIST (TTS)
  // Model: gemini-3.8-flash-lite-tts
  app.post('/api/voice-assist', async (req, res) => {
    try {
      const { text, voiceName } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }
      const audioBase64 = await synthesizeVoiceAudio(text, voiceName || 'Kore');
      res.json({ audio: audioBase64 });
    } catch (error: any) {
      console.error('Error in voice synthesis:', error);
      res.status(500).json({ error: error?.message || 'Voice synthesis failed' });
    }
  });

  app.get('/api/preset-menus', (req, res) => {
    res.json(CURATED_MENUS);
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Enna Samayal? Meal Planner & AI Suite' });
  });

  // Vite middleware in dev, static files in production
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'));

  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(PORT) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Create HTTP & WebSocket Server for Live Voice API (gemini-3.8-live)
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('Live API client connected via WebSocket');
    const ai = getAI();
    if (!ai) {
      clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY required for real-time Live API' }));
      return;
    }

    try {
      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are Paati, an expert, loving South Indian grandmother and home kitchen mentor. You speak warmly with authentic kitchen insights (Kaipakuva, mustard tempering, flame level, sourness balance). Keep spoken answers concise, practical, and conversational for someone busy standing at the stove.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
      });

      clientWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        } catch (e) {
          console.error('Error forwarding audio to Live API:', e);
        }
      });

      clientWs.on('close', () => {
        session.close();
      });
    } catch (err: any) {
      console.error('Live API connection error:', err);
      clientWs.send(JSON.stringify({ error: err?.message || 'Live session failed' }));
    }
  });

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Enna Samayal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

