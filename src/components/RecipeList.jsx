import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {doc, collection, getDocs, query } from 'firebase/firestore'
import {db} from '../firebase.config'
import RecipeListItem from '../components/RecipeListItem'
import {Col} from 'react-bootstrap'

function RecipeList(props) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [recipes, setRecipes] = useState(null)

    useEffect(() => {
        const fetchUserRecipes = async () => {
            const querySnap = await getDocs(props.query)

            let recipes = []
            querySnap.forEach((doc) => {
              return recipes.push({
                  id: doc.id,
                  data: doc.data()
              })
            })
            recipes = recipes.slice(0,props.limit)
            shuffle(recipes)
            setRecipes(recipes)
            setLoading(false)
        }

        fetchUserRecipes()
    }, [])

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