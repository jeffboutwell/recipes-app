import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import {doc, collection, getDocs, query, limit, orderBy, where, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'

const search = instantsearch({
    appId: "9LOX4ZY5KD",
    apiKey: "5c00faf5dfca48cde9b145547482ccdc",
    indexName: "recipes_jeffboutwell",
    searchParameters: {
      hitsPerPage: 5,
      attributesToSnippet: ["description:24"],
      snippetEllipsisText: " [...]"
    }
  });

index.setSettings({
    // Select the attributes you want to search in
    searchableAttributes: [
      'name', 'tags', 'ingredients', 'description'
    ],
    // Define business metrics for ranking and sorting
    customRanking: [
      'desc(popularity)'
    ],
    // Set up some attributes to filter results on
    attributesForFaceting: [
      'tags', 'searchable(name)'
    ]
  });

function SearchBar() {
    //const client = algoliasearch('9LOX4ZY5KD', '346935800babfeae253d0c96158ff377')
    //const index = client.initIndex('recipes_jeffboutwell')

/*     const sendAlgoliaData = async () => {
        const fetchDataFromDatabase = async () => {
            const recipesRef = collection(db,'recipes')
            const q = query(recipesRef)
      
            const qSnap = await getDocs(q)
            let resultsArray = []
            qSnap.forEach((doc) => {
              resultsArray.push(doc.data())
            })
            if(resultsArray.length>0) {
                return resultsArray
            } else {
              console.log('Doc does not exist')
            }
      }
      
      //const records = await fetchDataFromDatabase();
      //index.saveObjects(records, { autoGenerateObjectIDIfNotExist: true });
    }

    sendAlgoliaData() */

  return (
    <InstantSearch indexName="demo_ecommerce" searchClient={searchClient}>
        <div className="left-panel">
        <ClearRefinements />
        <h2>Recipes</h2>
        <RefinementList attribute="tags" />
        <Configure hitsPerPage={8} />
        </div>
        <div className="right-panel">
        <SearchBox />
        <Hits hitComponent={Hit} />
        <Pagination />
        </div>
    </InstantSearch>
  )
}

function Hit(props) {
    return (
      <div>
  <h2>{props.hit.name}</h2>
      </div>
    );
  }

export default SearchBar