function SuggestionPills({setIngredients}:{setIngredients:(value:string)=>void}){
    const suggestions = ['Pasta Night','Leftover Chicken','Homemade Pizza']
    return(
        <div className="Pillcontainer">
            <p>try:</p>
           {suggestions.map((item)=>(
            <button className='suggestion' key={item} onClick={()=> setIngredients(item)}>{item}</button>
           ))}
        </div>
    )
} export default SuggestionPills