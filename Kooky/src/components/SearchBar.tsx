type SearchBarProps = {
  ingredients: string
  setIngredients: (value: string) => void
  handleSearch: () => void
}

function SearchBar({ ingredients, setIngredients, handleSearch }: SearchBarProps) {
  return (
    <div className="searchbar-container">
      <input
        className="searchBar"
        type="text"
        placeholder="tomatoes, basil, garlic..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <button className="kook" onClick={handleSearch}>KOOK</button>
    </div>
  )
}

export default SearchBar