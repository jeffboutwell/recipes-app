import {Link} from 'react-router-dom'

function Home() {
  return (
      <div className="explore">
        <header>
          <p className="pageHeader">Recipes</p>
        </header>
        <main>
          {/*slider*/}
          <p className="recipeCategoryHeading">Categories</p>
          <div className="recipeCategories">
            <Link to='/category/entree'>
              <img className='recipeCategoryImg' alt='entree' />
            </Link>
          </div>
        </main>
      </div>
  )
}

export default Home