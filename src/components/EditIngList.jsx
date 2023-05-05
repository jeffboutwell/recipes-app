import React from 'react'
import {useState,useEffect} from 'react'
import {Form, FormLabel } from 'react-bootstrap'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import arrayMove from 'array-move'
import EditIng from './EditIng'

function EditIngList(props) {
    const [ingArray,setIngArray] = useState(props.ingList)

    const onSortEnd = (oldIndex, newIndex) => {
        console.log('onSortEnd',oldIndex,newIndex)
        setIngArray((array) => arrayMove(array, oldIndex, newIndex))
    }

    const updateIngItem = (index,ingItem) => {
        let ingArrayCopy = ingArray
        ingArrayCopy[index] = ingItem
        setIngArray(ingArrayCopy)
    }

    const deleteIngItem = index => {
        let ingArrayCopy = ingArray
        ingArrayCopy.pop(index)
        setIngArray(ingArrayCopy)
    }

    useEffect(() => {
        props.updateIngList(ingArray)
        console.log('ingArray',ingArray)
    }, [ingArray])

  return (
    <Form.Group className="form-group" controlId="ingredients">
        <Form.Label>Ingredients</Form.Label>
        <SortableList onSortEnd={onSortEnd} className="ing-list" draggedItemClassName="dragged-ing" lockAxis='y'>
            {ingArray.map((item,index) => (
                <EditIng index={index} key={item.name.replace(' ','-')} ing={item} deleteIng={deleteIngItem} updateIng={updateIngItem} />
            ))}
        </SortableList>
    </Form.Group>
  )
}

export default EditIngList