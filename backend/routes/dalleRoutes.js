import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    console.log('Received prompt:', prompt); // Log the prompt received

    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
    });

    console.log('AI Response:', aiResponse); // Log the entire AI response

    // Ensure aiResponse contains expected structure
    if (!aiResponse.data || !aiResponse.data[0] || !aiResponse.data[0].b64_json) {
      return res.status(500).json({ error: 'Invalid response structure from OpenAI.' });
    }

    const image = aiResponse.data[0].b64_json;  // Access the first image in the response
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error('Error during image generation:', error); // Log the error
    res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
  }
});

export default router;


