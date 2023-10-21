import React from 'react'
import {Link} from 'react-router-dom'

function SearchHit({hit}) {
    return (
        <article>
          <Link to={`/recipe/${hit.slug}`} className='searchRecipeLink'>
          <img src={hit.image} alt={hit.name} />
          <p>{hit.categories[0]}</p>
          <h1>{hit.name}</h1>
          <p>${hit.price}</p>
          </Link>
        </article>
      );
}

export default SearchHit