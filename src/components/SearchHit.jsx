import React from 'react'

function SearchHit({hit}) {
    return (
        <article>
          <img src={hit.image} alt={hit.name} />
          <p>{hit.categories[0]}</p>
          <h1>{hit.name}</h1>
          <p>${hit.price}</p>
        </article>
      );
}

export default SearchHit