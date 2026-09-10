import Plate from './Plate'
import SearchBar from './SearchBar'
import SuggestionPills from './SuggestionPills'

type SearchCardProps = {
  ingredients: string
  setIngredients: (value: string) => void
  handleSearch: () => void
  isSearching: boolean
}

function SearchCard({ ingredients, setIngredients, handleSearch, isSearching }: SearchCardProps) {
  return (
    <div className="card">
      <Plate />
      <SearchBar ingredients={ingredients} setIngredients={setIngredients} handleSearch={handleSearch} isSearching={isSearching} />
      <SuggestionPills setIngredients={setIngredients} />
    </div>
  )
}

export default SearchCard