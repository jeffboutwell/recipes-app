import {useState, useEffect} from 'react'
import {doc, collection, getDocs, query, limit, orderBy, where, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {Row,Col} from 'react-bootstrap'
import CategoryListItem from '../components/CategoryListItem'

function Categories() {
    const [categoryList,setCategoryList] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecipeCategories = async () => {
            const recipesRef = collection(db,'tags')
            const q = query(recipesRef, orderBy('tagDisplay'))
      
            const qSnap = await getDocs(q)
            let resultsArray = []
            qSnap.forEach((doc) => {
              resultsArray.push(doc.data())
            })
            if(resultsArray.length>0) {
                setCategoryList(resultsArray)
                setLoading(false)
            } else {
              console.log('Doc does not exist')
            }
          }
      
          fetchRecipeCategories()
    }, [])

  return (
    <>
        <h1>Categories</h1>
        {!loading && categoryList?.length > 0 && (
            <Row>
            {categoryList.map((category) => (
            <Col key={category.tagSlug} xs={12} md={6} lg={4} xl={3}>
                <CategoryListItem name={category.tagDisplay} slug={category.tagSlug} />
            </Col>
            ))}
            </Row>
        )}
    </>
  )
}

export default Categories