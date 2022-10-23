import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from 'react-bootstrap';
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Category from './pages/Category'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import CreateRecipe from './pages/CreateRecipe'

import 'bootstrap/dist/css/bootstrap.min.css';
import Recipe from './pages/Recipe';


function App() {
  return (
    <div className='App'>
      <Router>
      <Container>
        <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/category/:categoryName' element={<Category />} />
            <Route path='/recipe/:recipeSlug' element={<Recipe />} />
            <Route path='/profile' element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
            </Route>
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/create-recipe' element={<CreateRecipe />} />
          </Routes>
        </Container>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
