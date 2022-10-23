import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {getDoc,doc,collection,query,where, getDocs} from 'firebase/firestore'
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
        //console.log(recipe)
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
    <Container>
        <div className="shareIconDiv" onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          toast.info('Link copied!')
        }}>
          <p><i className="fa-solid fa-share" alt='Share Link'></i></p>
          <p>View <a href={recipe.sourceUrl} target='_blank'>original recipe</a></p>
        </div>
        <h1>{recipe.name}</h1>
        <Image fluid src={recipe.imgUrls[0]}></Image>
        <Container>
          <Row>
            <Col>
              <h2>Ingredients</h2>
              <ListGroup as='ul' variant='flush'>
                {recipe.ingredients.map(function(ing,index){
                  return <ListGroup.Item key={index} as='li'>{`${ing.amt} ${ing.unit} ${ing.name}`}</ListGroup.Item>
                })}
              </ListGroup>
            </Col>
            <Col>
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