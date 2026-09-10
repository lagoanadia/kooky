import { useState } from 'react'
import SearchCard from './components/SearchCard'
import RecipeList from './components/RecipeList'
import Logo from './components/Logo'
import SocialLinks from './components/SocialLinks'
import { API_BASE_URL } from './config'
import './App.css'

function App() {
  const [ingredients, setIngredients] = useState<string>('')
  const [recipes, setRecipes] = useState<any[]>([])
  const [searchError, setSearchError] = useState<string>('')
  const [isSearching, setIsSearching] = useState<boolean>(false)

  const handleSearch = async () => {
    const trimmed = ingredients.trim()
    if (!trimmed) {
      setSearchError('Enter at least one ingredient first.')
      setRecipes([])
      return
    }

    setIsSearching(true)
    setSearchError('')
    try {
      const response = await fetch(`${API_BASE_URL}/recipes?ingredients=${encodeURIComponent(trimmed)}`);
      const data = await response.json();

      if (!response.ok || !Array.isArray(data)) {
        setSearchError(data?.error || 'Something went wrong. Please try again.')
        setRecipes([])
        return
      }

      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setSearchError('Could not reach the server. Please try again.')
      setRecipes([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
   <div className="header">
      <Logo />
      <SocialLinks />
    </div>
    <SearchCard ingredients={ingredients} setIngredients={setIngredients} handleSearch={handleSearch} isSearching={isSearching} />
    {searchError && <p className="search-error">{searchError}</p>}
    <RecipeList recipes={recipes} />
    </>
  )
}

export default App