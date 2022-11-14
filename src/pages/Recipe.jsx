import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {collection,query,where, getDocs} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import {Container,Row,Col,Image, ListGroup} from 'react-bootstrap'
import { toast } from 'react-toastify'

function Recipe() {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipesRef = collection(db,'recipes')
      const q = query(recipesRef, where('slug', '==', params.recipeSlug))

      const qSnap = await getDocs(q)
      let resultsArray = []
      qSnap.forEach((doc) => {
        resultsArray.push(doc.data())
      })
      if(resultsArray.length>0) {
        setRecipe(resultsArray[0])
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

  return (
    <Container className='recipe'>
        <div className="shareIconDiv" onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          toast.info('Link copied!')
        }}>
          <p><i className="fa-solid fa-share" alt='Share Link'></i></p>
          <p>View <a href={recipe.sourceUrl} target='_blank'>original recipe</a></p>
        </div>
        <Container>
          <Row className='meta'>
            {recipe.tags.length > 0 && (
              recipe.tags.map(function(tag,index){
                  return (
                    <Col className='tags' key={index}>
                      <Link to={{ pathname: `/category/${tag}` }}>
                        <span className="tag">{tag}</span>
                      </Link>
                    </Col>
                  )
                })
              )}
          </Row>
          <Row className='info'>
            <Col>
              <h1>{recipe.name}</h1>
              <p className="desc">{recipe.description}</p>
              {recipe.sourceUrl && recipe.sourceName && (
                  <p className="source">Source: <a href={recipe.sourceUrl} title='View original recipe' target='_blank'>{recipe.sourceName}</a></p>
                )
              }
            </Col>
            <Col md={8}>
              <Image fluid src={recipe.imgUrls[0]+'&tr=w-800,h-500'}></Image>
            </Col>
          </Row>
          <Row className='ing-dir'>
            <Col md={6}>
              <h2>Ingredients</h2>
              <ListGroup as='ul' variant='flush'>
                {recipe.ingredients.map(function(ing,index){
                  return <ListGroup.Item key={index} as='li'>{`${ing.amt} ${ing.unit} ${ing.name}`}</ListGroup.Item>
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
        </Container>
    </Container>
  )
}

export default Recipe