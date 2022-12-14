import {useState, useEffect} from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useNavigate, Link} from 'react-router-dom'
import {Container,Row,Col} from 'react-bootstrap'
import RecipeList from '../components/RecipeList'
import RecipeListItem from '../components/RecipeListItem'
import {toast} from 'react-toastify'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const navigate = useNavigate()
  const {name, email} = formData

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        // Update displayName in fb
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        //Update in fs
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      toast.error('Could not update user profile')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onEdit = (recipeSlug) => navigate(`/edit-recipe/${recipeSlug}`)
  const recipesRef = collection(db, 'recipes')
  const q = query(recipesRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

  return <div className='profile'>
    <header className="profileHeader">
      <h1>My Profile</h1>
      <button type="button" className="logOut" onClick={onLogout}>
        Logout
      </button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        <p className="changePersonalDetails" onClick={() => {
          changeDetails && onSubmit()
          setChangeDetails((prevState) => !prevState)
        }}>
          {changeDetails ? 'done' : 'change'}
        </p>
      </div>
      <div className="profileCard">
        <form action="">
          <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />
          <input type="text" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange} />
        </form>
      </div>
      <Link to='/create-recipe'>
        <p>Create Recipe</p>
      </Link>


      <h2>My Recipes</h2>
      <Container>
        <Row className='recipeList'>
          <RecipeList format="minimal" query={q} imgW="500" imgH="300" allowEdit={true} />
        </Row>
      </Container>
    </main>
  </div>
}

export default Profile