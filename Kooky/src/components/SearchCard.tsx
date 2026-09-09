import Plate from './Plate'
import SearchBar from './SearchBar'
import SuggestionPills from './SuggestionPills'

type SearchCardProps = {
  ingredients: string
  setIngredients: (value: string) => void
  handleSearch: () => void
}

function SearchCard({ ingredients, setIngredients, handleSearch }: SearchCardProps) {
  return (
    <div className="card">
      <Plate />
      <SearchBar ingredients={ingredients} setIngredients={setIngredients} handleSearch={handleSearch} />
      <SuggestionPills setIngredients={setIngredients} />
    </div>
  )
}

export default SearchCard