import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import {getAuth} from 'firebase/auth'
import {doc, collection, getDocs, query, limit, orderBy, where, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import RecipeList from '../components/RecipeList'
import {Container,Row,Col,Image} from 'react-bootstrap'

function Home() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [featuredRecipe, setFeaturedRecipe] = useState(null)
  const [recipes, setRecipes] = useState(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipesRef = collection(db,'recipes')
      const q = query(recipesRef, orderBy('timestamp','desc'))

      const qSnap = await getDocs(q)
      let resultsArray = []
      qSnap.forEach((doc) => {
        resultsArray.push(doc.data())
      })
      if(resultsArray.length>0) {
        setRecipes(resultsArray)
        const randRecipeInd = Math.floor(Math.random() * resultsArray.length)
        setFeaturedRecipe(resultsArray[randRecipeInd])
        setLoading(false)
      } else {
        console.log('Doc does not exist')
      }
    }

    fetchRecipe()
  }, [])

  const recipesRef = collection(db, 'recipes')
  const q = query(recipesRef, orderBy('timestamp', 'desc'))

  return (
      <div className='home'>
        <main>
        <Container className='featured'>
              <Row>
                <Col>
                  {!loading && recipes?.length > 0 && (
                    <>
                      <Link to={`/recipe/${featuredRecipe.slug}`}>
                        <Image fluid src={featuredRecipe.imgUrls[0]+'&tr=w-1500,h-600'}></Image>
                      </Link>
                      <Link to={`/recipe/${featuredRecipe.slug}`}>
                        <h2>{featuredRecipe.name}</h2>
                      </Link>
                      <p className='desc'>{featuredRecipe.description}</p>
                      {featuredRecipe.sourceUrl && featuredRecipe.sourceName && (
                          <p className="source">Source: <a href={featuredRecipe.sourceUrl} title='View original recipe' target='_blank'>{featuredRecipe.sourceName}</a></p>
                        )
                      }
                    </>
                  )}
                </Col>
              </Row>
            </Container>
            <Container className='recent'>
              <h2>Most Recent</h2>
              <Row className='recipeList'>
                <RecipeList format="minimal" query={q} imgW="500" imgH="300" allowEdit={false} limit="4" />
              </Row>
            </Container>
        </main>
      </div>
  )
}

export default Home