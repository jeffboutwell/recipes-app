import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {collection,query,where,getDocs} from 'firebase/firestore'
//import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import {Container,Row,Col,Image, ListGroup} from 'react-bootstrap'
import RecipeList from '../components/RecipeList'
//import NewRecipeList from '../components/NewRecipeList'
import { toast } from 'react-toastify'

function Recipe() {
  const [recipe, setRecipe] = useState(null)
  const [recipeID, setRecipeID] = useState(null)
  const [loading, setLoading] = useState(true)
  //const [recipeQuery, setRecipeQuery] = useState(null)
  //const [relatedQuery,setRelatedQuery] = useState(null)
  //const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  //const auth = getAuth()

  useEffect(() => {
    console.log('useEffect - recipe')
    const fetchRecipe = async () => {
      const recipesRef = collection(db,'recipes')
      const q = query(recipesRef, where('slug', '==', params.recipeSlug))

      const qSnap = await getDocs(q)
      let resultsArray = []
      let idArray = []
      qSnap.forEach((doc) => {
        resultsArray.push(doc.data())
        idArray.push(doc.id)
      })
      if(resultsArray.length>0) {
        setRecipe(resultsArray[0])
        console.log('resultsArray',resultsArray[0])
        setRecipeID(idArray[0])
        setLoading(false)
      } else {
        console.log('Doc does not exist')
      }
    }

    fetchRecipe()
  }, [navigate,params.recipeSlug])

  if(loading) {
    return <p>Loading...</p>
  }

  const recipesRef = collection(db, 'recipes')
  let q
  if(recipe.tags.length>0) {
    //const recipeTags = recipe.tags.splice(recipe.tags.indexOf('vegan'),1)
    q = query(recipesRef, where('tags', 'array-contains-any', recipe.tags))
  }

  return (
    <Container className='recipe p-0' fluid>
        <div className="shareIconDiv" onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          toast.info('Link copied!')
        }}>
        <p><i className="fa-solid fa-share" alt='Share Link'></i></p>
        </div>
        <Container className='recipeInner p-0' fluid>
        <Row className='info'>
            <Col className='mb-3'>
              <h1>{recipe.name}</h1>
              <p className="desc">{recipe.description}</p>
              {recipe.sourceUrl && recipe.source && (
                  <p className="source">Source: <a href={recipe.sourceUrl} title='View original recipe' target='_blank' rel='noreferrer'>{recipe.source}</a></p>
                )
              }
              {true && (
                <Link className='edit-link' to={`/edit-recipe/${recipe.slug}?id=${recipeID}`} title='Edit Recipe'>Edit Recipe <i className="fa-solid fa-pen-to-square"></i></Link>
              )}
            </Col>
            <Col md={8} className='p-0'>
              <Image fluid src={recipe.imgUrls[0]+'&tr=w-1000,h-600'}></Image>
            </Col>
          </Row>
          <Row className='meta mt-3 mb-5'>
            {recipe.servings && (
              <Col className='servings' xs={12} sm={4} lg={3}>Makes {recipe.servings}</Col>
            )}
            {recipe.prepTime && recipe.cookTime && (
              <Col className='totalTime' xs={12} sm={true}>Prep time: {recipe.prepTime} minutes | Cook time: {recipe.cookTime} minutes | Total time: {parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} minutes</Col>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
              <Col className='tags' sm={12} md={true}>
              {recipe.tags.map(function(tag,index){
                  return (
                      <Link to={{ pathname: `/category/${tag}` }} key={index}>
                        <span className="tag">{tag}</span>
                      </Link>
                  )
                })}
                </Col>
              )}
          </Row>
          <Row className='ing-dir'>
            <Col md={6}>
              <h2>Ingredients</h2>
              <ListGroup as='ul' variant='flush'>
                {recipe.ingredients.map(function(ing,index){
                  return <ListGroup.Item key={index} as='li'>{ing.amt} {ing.unit} {ing.name}</ListGroup.Item>
                })}
              </ListGroup>
            </Col>
            <Col md={6}>
              <h2>Directions</h2>
              <ListGroup as='ol' numbered variant='flush'>
              {recipe.directions.map(function(dir,index){
                  return <ListGroup.Item key={index} as='li'>{dir}</ListGroup.Item>
                })}
              </ListGroup>
            </Col>
          </Row>
          {recipe.notes && (
          <Row>
            <Col>
              <h2>Recipe Notes</h2>
              <p>{recipe.notes}</p>
            </Col>
          </Row>
          )}
        </Container>
        {recipe.tags.length>0 && (
          <Container className='recent' fluid>
          <h2>Related Recipes</h2>
          <Row className='recipeList'>
            <RecipeList format="minimal" excludeID={recipeID} key={recipeID} query={q} imgW="500" imgH="300" limit={4} allowEdit={false} />
          </Row>
        </Container>
        )}

    </Container>
  )
}

export default Recipe