import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, useInstantSearch } from 'react-instantsearch-hooks-web';
import {doc, collection, getDocs, query, limit, orderBy, where, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import SearchHit from './SearchHit'

const searchClient = algoliasearch('9LOX4ZY5KD', '5c00faf5dfca48cde9b145547482ccdc');

function SearchBar(props) {
  return (
    <InstantSearch searchClient={searchClient} indexName="recipes_jeffboutwell" {...props}>
      <SearchBox />
      <NoResultsBoundary fallback={<NoResults />}>
        <Hits hitComponent={SearchHit} />
      </NoResultsBoundary>
    </InstantSearch>
  )
}

function NoResultsBoundary({ children, fallback }) {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned yet.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div>
      <p>
        No results for <q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}

export default SearchBar