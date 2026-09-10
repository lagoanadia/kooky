import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'
import rateLimit from 'express-rate-limit'
dotenv.config()
const groq = new Groq({apiKey: process.env.GROQ_API_KEY})


const app = express()
const PORT = process.env.PORT || 3000

// Only the deployed frontend (and local dev) may call this API.
// Set FRONTEND_URL in production (e.g. https://your-app.vercel.app).
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // vite dev server
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // allow no-origin requests (curl, server-to-server, health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))
app.use(express.json()) // in case of a POST ( frontend  [ingredients] --> backend) the data comes in raw so this converts it to a JS object so we can later do req.body.ingredients

// Shared secrets (Groq/Spoonacular API keys) live behind these public
// endpoints with no login, so cap how often any one visitor can call them —
// otherwise one bot can burn the whole day's Spoonacular quota or run up
// the Groq bill in seconds.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30,                 // 30 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
})

app.get('/test',(req, res) => {
    res.json({msg: 'Server running'})
})

app.listen(PORT, ()=> {
    console.log('Server in port :'+PORT)
})

app.get('/recipes', apiLimiter, async(req,res)=>{
    const ingredients = req.query.ingredients

    if(!ingredients){
        return res.status(400).json({error: 'No ingredients provided'})
    }
    try{
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=5&apiKey=${process.env.SPOONACULAR_API_KEY}`)
        const data = await response.json()

        // Spoonacular returns HTTP 200 with an error-shaped body (e.g. quota
        // exceeded) instead of a real HTTP error status, so check the shape
        // of the data itself, not just response.ok.
        if (!response.ok || !Array.isArray(data)) {
            console.error('Spoonacular error:', data)
            return res.status(502).json({
                error: "Kooky's recipe search hit its daily limit 🍳 — please check back tomorrow, or try again in a bit."
            })
        }

        res.json(data)
    }
    catch(error){
        res.status(500).json({error: 'Error fetching recipes'})
    }
})


app.post('/ai', apiLimiter, async (req, res) => {
  const recipe = req.body.recipe

  if (!recipe) {
    return res.status(400).json({ error: 'No recipe found' })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef writing concise, practical cooking tips. ' +
            'Reply with ONLY a JSON object of the form {"tips":[{"title":"...","detail":"..."}]} ' +
            'containing exactly 3 tips. "title" is a short 2-5 word label (no numbering, no markdown, ' +
            'no asterisks). "detail" is one plain-text sentence, no markdown formatting.'
        },
        {
          role: 'user',
          content: `Give me 3 cooking tips for this recipe: ${recipe}`
        }
      ],
      model: 'openai/gpt-oss-20b',
      response_format: { type: 'json_object' }
    })

    const raw = completion.choices[0].message.content
    let tips
    try {
      const parsed = JSON.parse(raw)
      tips = Array.isArray(parsed.tips) ? parsed.tips : null
    } catch {
      tips = null
    }

    // Fall back to showing the raw text as a single tip if the model
    // didn't return valid structured JSON, so the feature degrades
    // gracefully instead of breaking.
    if (!tips) {
      tips = [{ title: 'Tip', detail: raw }]
    }

    res.json({ tips })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})