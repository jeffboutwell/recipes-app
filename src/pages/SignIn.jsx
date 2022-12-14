import {useState} from 'react'
import {toast} from 'react-toastify'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import OAuth from '../components/OAuth'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const {email,password} = formData

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try{
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
  
      if(userCredential.user) {
        navigate('/')
      }
    } catch(error) {
      toast.error('Bad user credentials')
    }
  }

  return (
    <>
      <h1>Welcome Back!</h1>
      <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={onChange} value={email} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" onChange={onChange} value={password} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Show Password" onClick={() => setShowPassword((prevState) => !prevState)} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Sign In
      </Button>
    </Form>
    <Link to='/forgot-password'>Forgot Password</Link>

    <OAuth />
    <Link to='/sign-up' className='registerLink'>
      Sign Up Instead
    </Link>
    </>
  )
}

export default SignIn