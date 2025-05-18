require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await client.chat.completions.create({
      extra_headers: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Chat Website",
      },
      model: "meta-llama/llama-3.3-8b-instruct:free",
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Произошла ошибка при обработке запроса' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
}); 