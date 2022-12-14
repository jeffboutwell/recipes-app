import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'

function RecipeListItem({recipe,id,onDelete,imgW,imgH,allowEdit}) {

  return (
    <Card className='recipe'>
        <Link to={`/recipe/${recipe.slug}`} recipeid={id} className='categoryRecipeLink'>
            <Card.Img src={recipe.imgUrls[0]+`&tr=w-${imgW},h-${imgH}`} alt={recipe.name} varient='top' />
            <Card.Title>{recipe.name}</Card.Title>
        </Link>
        {onDelete && (
          <p>Trash can icon</p>
        )}
        {allowEdit && (
          <Link className='edit-link' to={`/edit-recipe/${recipe.slug}?id=${id}`} title='Edit Recipe'><i className="fa-solid fa-pen-to-square"></i></Link>
        )}
    </Card>
  )
}

export default RecipeListItem