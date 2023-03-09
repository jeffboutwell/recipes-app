import { useState, useEffect } from 'react'
import {doc, collection, getDocs, query, limit, orderBy, where, deleteDoc} from 'firebase/firestore'
import {Card} from 'react-bootstrap'
import {db} from '../firebase.config'
import {Link} from 'react-router-dom'

function CategoryListItem(props) {
    const [categoryImage, setCategoryImage] = useState(null)
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const fetchCategoryImage = async () => {
            const recipesRef = collection(db,'recipes')
            const q = query(recipesRef, where("tags", "array-contains", props.slug))
      
            const qSnap = await getDocs(q)
            let resultsArray = []
            qSnap.forEach((doc) => {
              resultsArray.push(doc.data())
            })
            if(resultsArray.length>0) {
                const randItem = Math.floor(Math.random()*resultsArray.length)
                const randRecipe = resultsArray[randItem]
                setCategoryImage(randRecipe.imgUrls[0])
                setLoading(false)
            } else {
              console.log('Doc does not exist')
            }
          }
      
          fetchCategoryImage()
    })

  return (
    <Card className='category'>
        <Link to={`/category/${props.slug}`}>
            <Card.Img src={`${categoryImage}&tr=w-500,h-300`} alt={props.name} varient='top' />
            <Card.Title>{props.name}</Card.Title>
        </Link>
    </Card>
  )
}

export default CategoryListItem