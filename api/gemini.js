// Vercel serverless function — server-side Gemini proxy.
// The API key lives in process.env.GEMINI_API_KEY (NOT VITE_ prefixed), so it
// never ships to the browser. The client posts { prompt, schema, temperature }.

const MODEL = 'gemini-2.5-flash'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    res.status(500).json({ error: 'Server is missing GEMINI_API_KEY' })
    return
  }

  const { prompt, schema, temperature = 0.8 } = req.body || {}
  if (!prompt) {
    res.status(400).json({ error: 'Missing prompt' })
    return
  }

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
      ...(schema && { responseSchema: schema })
    }
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    )
    const data = await r.json()
    if (!r.ok) {
      res.status(r.status).json({ error: data?.error?.message || `Gemini ${r.status}` })
      return
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      res.status(502).json({ error: 'Empty Gemini response' })
      return
    }
    // Gemini returns the JSON as a string (responseMimeType: application/json)
    res.status(200).json(JSON.parse(text))
  } catch (e) {
    res.status(500).json({ error: e.message || 'Proxy error' })
  }
}
