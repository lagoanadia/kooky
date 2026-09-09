import { useState } from 'react'
import { API_BASE_URL } from '../config'

type Recipe = {
  title: string
  image: string
}

type RecipeCardProps = {
  recipe: Recipe
}

type Tip = {
  title: string
  detail: string
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetTips = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe: recipe.title })
      })
      if (!response.ok) throw new Error('Request failed')
      const data = await response.json()
      setTips(data.tips ?? [])
    } catch (err) {
      console.error('Error fetching tips:', err)
      setError('Could not load tips right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recipe-card">
      <img className="recipe-image" src={recipe.image} alt={recipe.title} />
      <h3 className="recipe-title">{recipe.title}</h3>

      <button className="tips-button" onClick={handleGetTips} disabled={loading}>
        {loading ? 'Loading tips...' : 'Get cooking tips'}
      </button>

      {error && <p className="tips-error">{error}</p>}

      {tips.length > 0 && (
        <ol className="tips-list">
          {tips.map((tip, i) => (
            <li key={i} className="tips-item">
              <span className="tips-item-number">{i + 1}</span>
              <span>
                <span className="tips-item-title">{tip.title}</span>
                <span className="tips-item-detail">{tip.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default RecipeCard