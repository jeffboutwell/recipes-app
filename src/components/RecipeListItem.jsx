import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'

function RecipeListItem({recipe,id,onDelete,imgW,imgH}) {
  return (
    <Card className='recipe'>
        <Link to={`/recipe/${recipe.slug}`} className='categoryRecipeLink'>
            <Card.Img src={recipe.imgUrls[0]+`&tr=w-${imgW},h-${imgH}`} alt={recipe.name} varient='top' />
            <Card.Title>{recipe.name}</Card.Title>
        </Link>
        {onDelete && (
          <p>Trash can icon</p>
        )}
    </Card>
  )
}

export default RecipeListItem