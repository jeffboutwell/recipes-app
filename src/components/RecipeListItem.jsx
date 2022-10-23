import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'

function RecipeListItem({recipe,id,onDelete}) {
  return (
    <Card style={{ width: '18rem' }}>
        <Link to={`/recipe/${recipe.slug}`} className='categoryRecipeLink'>
            <Card.Img src={recipe.imgUrls[0]} alt={recipe.name} className='categoryRecipeImg' />
            <Card.Title>{recipe.name}</Card.Title>
        </Link>

        {onDelete && (
          <p>Trash can icon</p>
        )}
    </Card>
  )
}

export default RecipeListItem