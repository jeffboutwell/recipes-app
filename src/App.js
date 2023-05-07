import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { Container } from 'react-bootstrap';
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Category from './pages/Category'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'
import Recipe from './pages/Recipe'
import Sort from './pages/Sort'

function App() {

  return (
    <div className='App'>
      <Router>
      <Container fluid>
        <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='categories' element={<Categories />} />
            <Route path='/category/:categoryName' element={<Category />} />
            <Route path='/recipe/:recipeSlug' element={<Recipe />} />
            <Route path='/profile' element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
            </Route>
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/sort' element={<Sort />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/create-recipe' element={<CreateRecipe />} />
            <Route path='/edit-recipe/:recipeSlug' element={<EditRecipe />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
