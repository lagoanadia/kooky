type SearchBarProps = {
  ingredients: string
  setIngredients: (value: string) => void
  handleSearch: () => void
  isSearching: boolean
}

function SearchBar({ ingredients, setIngredients, handleSearch, isSearching }: SearchBarProps) {
  return (
    <div className="searchbar-container">
      <input
        className="searchBar"
        type="text"
        placeholder="tomatoes, basil, garlic..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <button className="kook" onClick={handleSearch} disabled={isSearching}>
        {isSearching ? 'Kooking...' : 'KOOK'}
      </button>
    </div>
  )
}

export default SearchBar