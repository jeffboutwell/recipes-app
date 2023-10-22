import {useState, useEffect} from 'react'
//import { useNavigate } from 'react-router-dom'
import { getDocs } from 'firebase/firestore'
import RecipeListItem from '../components/RecipeListItem'
import {Col} from 'react-bootstrap'

function RecipeList(props) {
    //const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [recipes, setRecipes] = useState(null)
    const [relatedQuery,setRelatedQuery] = useState(props.query)

    useEffect(() => {
      console.log('useEffect - related list query')
        const fetchUserRecipes = async () => {
            const querySnap = await getDocs(props.query)
            let recipeNames = []
            let recipesArray = []
            querySnap.forEach((doc) => {
              //console.log('id',doc.id)
              return recipesArray.push({
                  id: doc.id,
                  data: doc.data()
              })
            })
            recipesArray = recipesArray.filter(recipe => recipe.id != props.excludeID)
            if(recipesArray.length > props.limit) {
              let relatedArray = []
              do {
                const randomListIndex = Math.floor(Math.random()*recipesArray.length)
                relatedArray.push(recipesArray.splice(randomListIndex,1)[0])
              } while (relatedArray.length < props.limit)
              relatedArray.map(recipe => {
                recipeNames.push(recipe.data.name)
              })
              recipesArray = recipesArray.slice(0,props.limit)
              console.log('recipeNames',recipeNames)
              setRecipes(relatedArray)
            } else {
              setRecipes(recipesArray)
            }
            
            setLoading(false)
        }

        fetchUserRecipes()
    }, [relatedQuery])

  return (
    <>
      {!loading && recipes?.length > 0 && (
        <>
          {recipes.map((recipe) => (
          <Col key={recipe.id} xs={12} md={6} lg={3}>
              <RecipeListItem recipe={recipe.data} id={recipe.id} imgW={props.imgW} imgH={props.imgH} allowEdit={props.allowEdit} />
          </Col>
          ))}
        </>
      )}
    </>
  )
}

export default RecipeList