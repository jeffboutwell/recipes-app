import { useState } from 'react'
import algoliasearch from 'algoliasearch/lite'
import {Link} from 'react-router-dom'
import { InstantSearch, SearchBox, Hits, useInstantSearch } from 'react-instantsearch-hooks-web';
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";
import {doc, collection, getDocs, query, limit, orderBy, where, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import SearchHit from './SearchHit'

const searchClient = algoliasearch('9LOX4ZY5KD', '5c00faf5dfca48cde9b145547482ccdc')

function Hit({ hit }) {
  //console.log('hit:',hit)
  return (
    <Link to={`/recipe/${hit.slug}`} className='searchRecipeLink'>
    <article>
      <img src={hit.imgUrls[0]+`&tr=w-200,h-200`} alt={hit.name} />
      <p>{hit.name}</p>
    </article>
    </Link>
  );
}

function SearchBar(props) {
  const [showHits, setShowHits] = useState(false)

  const queryHook = (query, search) => {
    query ? setShowHits(true) : setShowHits(false)
    search(query)
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="recipes_jeffboutwell" {...props}>
      <SearchBox queryHook={queryHook} />
      {showHits ? <Hits hitComponent={Hit} /> : null}
    </InstantSearch>
  )
}

export default SearchBar