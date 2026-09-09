import { useState } from 'react'
import RecipeCard from './RecipeCard'

type RecipeListProps = {
  recipes: any[]
}

function RecipeList({ recipes }: RecipeListProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  if (!Array.isArray(recipes) || recipes.length === 0) {
    return null
  }

  // A new search can return fewer recipes than the last one, so clamp
  // instead of trusting currentIndex still points at a real recipe.
  const safeIndex = Math.min(currentIndex, recipes.length - 1)

  const handlePrev = () => {
    setCurrentIndex(safeIndex === 0 ? recipes.length - 1 : safeIndex - 1)
  }

  const handleNext = () => {
    setCurrentIndex(safeIndex === recipes.length - 1 ? 0 : safeIndex + 1)
  }

  return (
    <div className="recipe-list">
      <button onClick={handlePrev}>←</button>
      <RecipeCard key={safeIndex} recipe={recipes[safeIndex]} />
      <button onClick={handleNext}>→</button>
    </div>
  )
}

export default RecipeList