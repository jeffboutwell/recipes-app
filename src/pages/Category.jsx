import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import { Container } from 'react-bootstrap';
import RecipeListItem from '../components/RecipeListItem'

function Category() {
    const [recipes, setRecipes] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipesRef = collection(db,'recipes')
                const q = query(recipesRef,where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(10))
                const querySnap = await getDocs(q)
                let recipes = []
                querySnap.forEach((doc) => {
                    return recipes.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setRecipes(recipes)
                setLoading(false)
            } catch (error) {
                toast.error('Could not fetch recipes')
            }
        }

        fetchRecipes()
    },[params.categoryName])

  return (
      <Container>
        <header>
            <h1>
                {params.categoryName}
            </h1>
        </header>
        {loading ? (<p>Loading...</p>) : <>
            <main>
                <div className="categoryListings">
                    {recipes.map((recipe) => (
                        <RecipeListItem recipe={recipe.data} id={recipe.id} key={recipe.id} />
                    ))}
                </div>
            </main>
        </>}
      </Container>
  )
}

export default Category