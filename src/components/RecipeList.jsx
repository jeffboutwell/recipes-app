import {useState, useEffect} from 'react'
import {doc, collection, getDocs, query } from 'firebase/firestore'
import {db} from '../firebase.config'
import RecipeListItem from '../components/RecipeListItem'
import {Col} from 'react-bootstrap'

function RecipeList(props) {
    const [loading, setLoading] = useState(true)
    const [recipes, setRecipes] = useState(null)

    useEffect(() => {
        const fetchUserRecipes = async () => {
          console.log('RecipeList component')
            const querySnap = await getDocs(props.query)

            let recipes = []
            querySnap.forEach((doc) => {
            return recipes.push({
                id: doc.id,
                data: doc.data()
            })
            })
            setRecipes(recipes)
            setLoading(false)
        }

        fetchUserRecipes()
    }, [])

  return (
      <>
        {!loading && recipes?.length > 0 && (
              <>
                {recipes.map((recipe) => (
                <Col key={recipe.id} xs={12} md={6} lg={4} xl={3}>
                    <RecipeListItem recipe={recipe.data} id={recipe.id} imgW={props.imgW} imgH={props.imgH} />
                </Col>
                ))}
              </>
            )}
      </>
  )
}

export default RecipeList