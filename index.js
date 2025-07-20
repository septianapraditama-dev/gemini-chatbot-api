const express = require('express')
const dotenv = require('dotenv')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const cors = require('cors')

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cors())

// Initiate AI Model
const genAI = new GoogleGenerativeAI(process.env.API_KEY)
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
})

app.get('/', (req, res) => {
  res.send('Gemini API key connected ✅')
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})

// Route penting!
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Messsage is required.' });
    }

    try {
        const result = await model.generateContent(userMessage);
        const  response = await result.response;
        const text = await response.text();
        
        res.json({ response: text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
        }
    }

);