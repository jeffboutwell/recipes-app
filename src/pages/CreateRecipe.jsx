import {useState, useEffect, useRef} from 'react'
import {getAuth,onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {addDoc, collection, serverTimestamp,query,orderBy,getDocs} from 'firebase/firestore'
import {db} from '../firebase.config'
import {v4 as uuidv4} from 'uuid'
import {useNavigate} from 'react-router-dom'
import {Form, Button, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify'

function CreateRecipe() {
    const [formData,setFormData] = useState({
        name: '',
        description: '',
        type: '',
        ingredients: '',
        directions: '',
        images: {},
        featuredImage: ''
    })
    const {name,description,type,ingredients,directions,images,featuredImage} = formData
    const [loading, setLoading] = useState(false)
    const [tags, setTags] = useState(null)
    const [addTag, setAddTag] = useState(false)
    const [newTagText, setNewTagText] = useState(null)
    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

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
                setTags(resultsArray)
                setLoading(false)
                } else {
                console.log('Doc does not exist')
                }
        }

        fetchTags()
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        //Store images in Firebase
        const storeImage = async (image) => {
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
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            setLoading(false)
            toast.error('Images not uploaded.')
        })

        const createSlug = (name) => {
            return name == undefined ? '' : name.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
        }

        const ingArray = parseIngList(formData.ingredients)
        const dirArray = parseDirList(formData.directions)

        // Save data to DB
        const formDataCopy = {
            ...formData,
            slug: createSlug(name),
            imgUrls,
            ingredients: ingArray.array,
            directions: dirArray,
            timestamp: serverTimestamp()
        }

        formDataCopy.imgUrls.map((url) => {
            url = url.replace('https://firebasestorage.googleapis.com/v0/b/recipes-app-a8829.appspot.com','https://ik.imagekit.io/x25zmqidz')
        })

        delete formDataCopy.images
        const docRef = await addDoc(collection(db, 'recipes'), formDataCopy)
        setLoading(false)
        toast.success('Recipe saved')
        navigate(`/recipe/${formDataCopy.slug}`)

        setLoading(false)
    }

    const onMutate = e => {        
        let boolean = null
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

/********  Parse Ingredients  *********/
//Ingredients
const parseIngList = list => {
    //console.log('parseIngList: ', list);
    let ingList = list.split("\n");
    let ingArray = ingList.map(parseIng);
    console.log("ingList: ", ingList);
    return { text: ingList, array: ingArray };
}

const parseIng = ing => {
    let ingObj = {};
    if(!isCharacterALetter(ing.charAt(0))) {
        const firstSpaceIndex = ing.search(" ");
        ingObj.amt = ing.substr(0,firstSpaceIndex).trim();
        let unitObj = findIngUnit(ing);
        if(unitObj) {
            ingObj.unit = unitObj.unit;
            ingObj.name = unitObj.name;
        } else {
            ingObj.name = ing.substr(firstSpaceIndex).trim();
        }
    } else {
        ingObj.name = ing.trim();
    }
    return ingObj;
}

const findIngUnit = ing => {
    let indexOfUnit;
    let unitText;
    let ingName;
    const unitList = ['cups','cup','oz.','teaspoon','tsp','tablespoon','tbsp','cloves','clove','stalks','stalk','Tbsp'];
    if (unitList.some(function(v) {
        unitText = v;
        indexOfUnit = ing.indexOf(v)
        return indexOfUnit >= 0;
    })) {
        ingName  = ing.substr(indexOfUnit+unitText.length).trim();
        return {
            unit: unitText,
            index:indexOfUnit,
            name: ingName
        };
    } else {
        return null;
    }
}

function isCharacterALetter(char) {
    return (/[a-zA-Z]/).test(char)
  }

/********  end Parse Ingredients  *********/

/********  Parse Directions  *********/

//Directions
const parseDirList = list => {
    //console.log('parseIngList: ', list);
    let dirList = list.split("\n");
    console.log("dirList: ", dirList);
    return dirList;
}
/********  end Parse Directions  *********/

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
            setTags({
                ...tags,
                tagDataCopy
            })
            document.getElementById('new-tag').value = ''
        } else {
            alert('Please enter a name for the new tag.')
        }
    }

  return (
      <>
        <header>
            <h1>Create a Recipe</h1>
        </header>
        <main>
            <Form onSubmit={onSubmit}>
                <Form.Group className="form-group" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter recipe name" value={name} onChange={onMutate} required />
                </Form.Group>
                <Form.Group className="form-group" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter recipe description" rows='4' value={description} onChange={onMutate} required />
                </Form.Group>
                <Form.Group className="form-group" controlId="ingredients">
                    <Form.Label>Ingredients</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter recipe ingredients" rows='8' value={ingredients} onChange={onMutate} required />
                </Form.Group>
                <Form.Group className="form-group" controlId="directions">
                    <Form.Label>Directions</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter recipe directions" rows='8' value={directions} onChange={onMutate} required />
                </Form.Group>
                <FormGroup className="form-group" controlId='tags'>
                    <FormLabel>Tags</FormLabel>
                    {tags && tags.map((tag, index) => (
                        <Form.Check inline type="switch" id={`${tag.tagSlug}-switch`} label={tag.tagDisplay} />
                    ))}
                    <Button variant="outline-secondary" className='add-tag' onClick={showNewTagForm} size='sm' title='Create a new tag'>+</Button>
                    <FormGroup className={'new-tag-group' + (addTag ? " visible " : "")}>
                        <Form.Control type='text' placeholder='New Tag' id='new-tag' size='30' onChange={onTagTextChange} />
                        <Button varient='secondary' type='submit' onClick={createTag}>Add Tag</Button>
                    </FormGroup>
                </FormGroup>
                <Form.Group className="form-group" controlId="images">
                    <Form.Label>Images</Form.Label>
                    <Form.Control type="file" placeholder="Upload images" onChange={onMutate} max='6' accept='.jpg,.png,.jpeg' multiple required />
                </Form.Group>
                <Button variant='primary' type='submit'>Create Recipe</Button>
            </Form>
        </main>
      </>
  )
}

export default CreateRecipe