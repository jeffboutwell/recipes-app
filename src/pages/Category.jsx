import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection, getDocs, query, where, orderBy} from 'firebase/firestore'
import {db} from '../firebase.config'
import { Container, Row } from 'react-bootstrap';
import RecipeList from '../components/RecipeList'

function Category() {
    const [tag, setTag] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchTags = async () => {
          const tagsRef = collection(db,'tags')
          const q = query(tagsRef, where('tagSlug', '==', params.categoryName))
          const querySnap = await getDocs(q)

            let resultsArray = []
            querySnap.forEach((doc) => {
                resultsArray.push(doc.data())
                })
                if(resultsArray.length>0) {
                setTag(resultsArray[0])
                setLoading(false)
                } else {
                console.log('Doc does not exist')
                }
        }

        fetchTags()
    }, [params.categoryName])

    const recipesRef = collection(db,'recipes')
    const q = query(recipesRef, where('tags', 'array-contains', params.categoryName), orderBy('timestamp', 'desc'))

  return (
    <Container className='category'>
        <h1>{tag && tag.tagDisplay}</h1>
        <Row className='recipeList'>
            <RecipeList format="minimal" query={q} imgW="500" imgH="300" />
        </Row>
    </Container>
  )
}

export default Category