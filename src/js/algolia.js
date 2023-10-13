import algoliasearch from 'algoliasearch'
import {v4 as uuidv4} from 'uuid'

const client = algoliasearch(process.env.REACT_APP_ALGOLIA_KEY, process.env.REACT_APP_ALGOLIA_ADMIN_SECRET)
const index = client.initIndex(process.env.REACT_APP_ALGOLIA_INDEX)

export const updateAlgoliaRecord = updatedRecipe => {
    return new Promise((resolve,reject) => {
        index.findObject(hit => hit.slug == updatedRecipe.slug)
        .then(obj => {
            const algoliaObject = {
                ...updatedRecipe,
                objectID: obj.object.objectID
            }
            index.saveObject(algoliaObject).then(result => {
                resolve(result)
            })
        }).catch(reject => {
            console.log('Didn\'t find that one. Let\s add it.')
            const newAlgoliaObject = {
                ...updatedRecipe,
                objectID: `algoliaObjectID_${uuidv4()}`
            }
            index.saveObject(newAlgoliaObject).then(result => {
                resolve(result)
            })
        })
    })
}

export const addAlgoliaRecord = newRecipe => {
    return new Promise((resolve,reject) => {
        const newAlgoliaObject = {
            ...newRecipe,
            objectID: `algoliaObjectID_${uuidv4()}`
        }
        index.saveObject(newAlgoliaObject).then(result => {
            resolve(result)
        })
    })
}