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

            let recipesArray = []
            querySnap.forEach((doc) => {
              console.log('id',doc.id)
              return recipesArray.push({
                  id: doc.id,
                  data: doc.data()
              })
            })
            console.log('props.exclude',props.exclude)
            recipesArray = recipesArray.slice(0,props.limit)
            recipesArray = recipesArray.filter(recipe => recipe.id != props.exclude)
            //shuffle(recipesArray)
            setRecipes(recipesArray)
            setLoading(false)
        }

        fetchUserRecipes()
    }, [relatedQuery])

    function shuffle(array) {
      let currentIndex = array.length,  randomIndex;
      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    }

  return (
      <>
        {!loading && recipes?.length > 0 && (
            <ul>
              {recipes.map((recipe) => (
                  <li>{recipe.data.name}</li>
              ))}
            </ul>
        )}
        {!loading && recipes?.length > 0 && (
              <>
                {recipes.map((recipe) => (
                <Col key={recipe.id} xs={12} md={6} lg={4} xl={3}>
                    <RecipeListItem recipe={recipe.data} id={recipe.id} imgW={props.imgW} imgH={props.imgH} allowEdit={props.allowEdit} />
                </Col>
                ))}
              </>
            )}
      </>
  )
}

export default RecipeList