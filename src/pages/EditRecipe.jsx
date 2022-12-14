import React from "react"
import {useState, useEffect, useRef} from 'react'
import {getAuth,onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {addDoc, collection, serverTimestamp,query,orderBy,getDocs,doc,updateDoc,getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {v4 as uuidv4} from 'uuid'
import {useNavigate,useParams} from 'react-router-dom'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import arrayMove from 'array-move'
import {Form, Button, FormGroup, FormLabel, Container, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import EditImg from "../components/EditImg"
import {parseIngList,parseDirList,parseIngObj,parseDirArr} from '../js/recipeMods'

function EditRecipe() {
    const [formData,setFormData] = useState({
        name: '',
        servings: '',
        prepTime: '',
        cookTime: '',
        description: '',
        type: '',
        ingredients: '',
        directions: '',
        tags: [],
        notes: '',
        images: {},
        featuredImage: '',
        slug: ''
    })
    const {name,servings,prepTime,cookTime,description,type,ingredients,directions,tags,notes,images,featuredImage,slug} = formData
    const [loading, setLoading] = useState(false)
    const [allTags, setAllTags] = useState(null)
    const [addTag, setAddTag] = useState(false)
    const [newTagText, setNewTagText] = useState(null)
    const [tagArray, setTagArray] = useState([])
    const [recipeID, setRecipeID] = useState(null)
    //const [recipe, setRecipe] = useState(false)
    const [ingObjArray, setIngObjArray] = useState([])
    const [dirString, setDirString] = useState([])
    const auth = getAuth()
    const navigate = useNavigate()
    const params = useParams()
    const isMounted = useRef(true)

    //Load recipe from Firebase
    useEffect(() => {
      setLoading(true)
      const urlParams = (new URLSearchParams(window.location.search))
      setRecipeID(urlParams.get('id'))
      const fetchRecipe = async () => {
        const docRef = doc(db,'recipes',urlParams.get('id'))
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()) {
            setIngObjArray(parseIngObj(docSnap.data().ingredients))
            setTagArray(docSnap.data().tags)
            setFormData({
                ...docSnap.data(),
                ingredients: parseIngObj(docSnap.data().ingredients),
                directions: parseDirArr(docSnap.data().directions),
            })
            setLoading(false)
        } else {
            navigate('/')
            toast.error('Recipe does not exist.')
        }
      }

      fetchRecipe()
    }, [])

    // Fetch tags
    useEffect(() => {
        const fetchTags = async () => {
        const tagsRef = collection(db,'tags')
        const q = query(tagsRef, orderBy('tagDisplay'))
        const querySnap = await getDocs(q)

            let resultsArray = []
            querySnap.forEach((doc) => {
                resultsArray.push(doc.data())
                })
                if(resultsArray.length>0) {
                setAllTags(resultsArray)
                setLoading(false)
                } else {
                console.log('Doc does not exist')
                }
        }

        fetchTags()
    }, [])

    const onSortEnd = (oldIndex, newIndex) => {
        setIngObjArray((array) => arrayMove(array, oldIndex, newIndex))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        //Store images in Firebase
/*         const storeImage = async (image) => {
            return new Promise((resolve,reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed', 
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        }
                    }, 
                    (error) => {
                        reject(error)
                    }, 
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                        });
                    }
                );
            })
        } */

/*         const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            setLoading(false)
            toast.error('Images not uploaded.')
        }) */

        const createSlug = (name) => {
            return name == undefined ? '' : name.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
        }

        //const ingArray = parseIngObj(formData.ingredients)
        const dirArray = parseDirList(formData.directions)

        const tagSlugArray = []
        tagArray.map((tag) => {
            tagSlugArray.push(tag.replace('-tag-switch',''))
        })

        // Save data to DB
        const formDataCopy = {
            ...formData,
            slug: formData.slug,
            imgUrls: formData.imgUrls,
            ingredients: ingObjArray,
            directions: dirArray,
            tags: tagSlugArray,
            timestamp: serverTimestamp()
        }
        let updatedImgUrls = []
        formDataCopy.imgUrls.map((url) => {
            updatedImgUrls.push(url.replace('https://firebasestorage.googleapis.com/v0/b/recipes-app-a8829.appspot.com','https://ik.imagekit.io/x25zmqidz'))
        })
        formDataCopy.imgUrls = updatedImgUrls

        //Update recipe
        delete formDataCopy.images
        const docRef = doc(db,'recipes',recipeID)
        //console.log('formDataCopy',formDataCopy)
        await updateDoc(docRef,formDataCopy)
        setLoading(false)
        toast.success('Recipe updated')
        navigate(`/recipe/${formDataCopy.slug}`)

        setLoading(false)
    }

    const onMutate = e => {        
        let boolean = null
        if(e.target.id.includes('tag-switch')) {
            const tagId = e.target.id.replace('-tag-switch','')
            if(!tagArray.includes(tagId)) {
                console.log('adding: ' + tagId,tagArray)
                tagArray.push(tagId)
            } else {
                console.log('removing',tagArray)
                tagArray.pop(tagId)
            }
        }
        if(e.target.value === 'true') {
            boolean = true
        }
        if(e.target.value === 'false') {
            boolean = false
        }

        //Files
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }
        
        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef: user.uid})
                } else {
                    navigate('/sign-in')
                }
            })
        } else {
            navigate('/sign-in')
        }
        return() => {
            isMounted.current = false
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[isMounted])

    if(loading) {
        return <p>Loading...</p>
    }


    const showNewTagForm = () => {
        setAddTag(true)
    }

    const onTagTextChange = (e) => {
        setNewTagText(e.target.value)
    }

    const createTag = async () => {
        if(newTagText) {
            const slug = undefined ? '' : newTagText.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
            const tagDataCopy = {
                tagDisplay: newTagText,
                tagSlug: slug
            }
            const tagRef = await addDoc(collection(db, 'tags'), tagDataCopy)
            setAllTags({
                ...allTags,
                tagDataCopy
            })
            document.getElementById('new-tag').value = ''
        } else {
            alert('Please enter a name for the new tag.')
        }
    }

    const cancelChanges = e => {
        navigate(`/recipe/${slug}`)
    }

  return (
      <>
        <header>
            <h1>Edit Recipe</h1>
        </header>
        <main id='editRecipe'>
            <Form onSubmit={onSubmit}>
                <Form.Group className="form-group" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter recipe name" value={name} onChange={onMutate} required />
                </Form.Group>
                <Form.Group className="form-group" controlId="servings">
                    <Form.Label>Servings</Form.Label>
                    <Form.Control type="text" placeholder="Enter number of servings" value={servings} onChange={onMutate} required />
                </Form.Group>
                <Form.Group className="form-group" controlId="prepTime">
                    <Form.Label>Prep Time</Form.Label>
                    <Form.Control type="text" placeholder="Enter prep time" value={prepTime} onChange={onMutate} required />
                </Form.Group>
                <Form.Group className="form-group" controlId="cookTime">
                    <Form.Label>Cook Time</Form.Label>
                    <Form.Control type="text" placeholder="Enter cook time" value={cookTime} onChange={onMutate} required />
                </Form.Group>
                <Form.Group className="form-group" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter recipe description" rows='4' value={description} onChange={onMutate} required />
                </Form.Group>
                <Form.Group className="form-group" controlId="ingredients">
                    <Form.Label>Ingredients</Form.Label>
                    <SortableList onSortEnd={onSortEnd} className="ing-list" draggedItemClassName="dragged-ing" lockAxis='y'>
                        {ingObjArray && ingObjArray.map((ing, index) => (
                            <SortableItem key={`ingGroup-${index}`}>
                                <Form.Group className={`ingGroup ingGroup-${index}`}>
                                    <SortableKnob><i className="fa-solid fa-sort"></i></SortableKnob>
                                    <Form.Control className='ingListItem amt' type="text" placeholder="amount" value={ing.amt} onChange={onMutate} />
                                    <Form.Control className='ingListItem unit' type="text" placeholder="unit" value={ing.unit} onChange={onMutate} />
                                    <Form.Control className='ingListItem name' type="text" placeholder="name" value={ing.name} onChange={onMutate} />
                                </Form.Group>
                            </SortableItem>
                        ))}
                    </SortableList>
                </Form.Group>
                <Form.Group className="form-group" controlId="directions">
                    <Form.Label>Directions</Form.Label>
                    <Form.Control as="textarea" placeholder="directions" rows='8' value={directions} onChange={onMutate} required />
                </Form.Group>
                <FormGroup className="form-group" controlId='tags'>
                    <FormLabel>Tags</FormLabel>
                    {allTags && allTags.map((tag, index) => (
                        <Form.Check inline type="switch" key={tag.tagSlug} className={tag.tagSlug} id={`${tag.tagSlug}-tag-switch`} slug={tag.tagSlug} label={tag.tagDisplay} checked={tagArray.includes(tag.tagSlug)} onChange={onMutate} />
                    ))}
                    <Button variant="outline-secondary" className='add-tag' onClick={showNewTagForm} size='sm' title='Create a new tag'>+</Button>
                    <FormGroup className={'new-tag-group' + (addTag ? " visible " : "")}>
                        <Form.Control type='text' placeholder='New Tag' id='new-tag' size='30' onChange={onTagTextChange} />
                        <Button varient='secondary' type='submit' onClick={createTag}>Add Tag</Button>
                    </FormGroup>
                </FormGroup>
                <Form.Group className="form-group" controlId="notes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter recipe notes" rows='8' value={notes} onChange={onMutate} />
                </Form.Group>
                <Form.Group className="form-group" controlId="images">
                    <Form.Label>Images</Form.Label>
                    <Container className='editImgThumbsCont'>
                        <Row>
                            {formData.imgUrls && formData.imgUrls.map((url,index) => (
                                <Col xs={4} sm={2} key={index}><EditImg url={url} /></Col>
                            ))}
                        </Row>
                    </Container>
                    <Form.Control type="file" placeholder="Upload images" onChange={onMutate} max='1' accept='.jpg,.png,.jpeg' multiple />
                </Form.Group>
                <Form.Group className="form-group buttons" controlId="buttons">
                    <Button variant='primary' type='submit'>Save Recipe</Button>
                    <Button variant='secondary' onClick={cancelChanges}>Cancel</Button>
                </Form.Group>
            </Form>
        </main>
      </>
  )
}

export default EditRecipe