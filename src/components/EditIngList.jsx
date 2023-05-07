import React from 'react'
import {useState,useEffect} from 'react'
import {Form,Button} from 'react-bootstrap'
import SortableList from 'react-easy-sort'
import arrayMove from 'array-move'
import {v4 as uuidv4} from 'uuid'
import EditIng from './EditIng'

function EditIngList(props) {
    const [ingArray,setIngArray] = useState(props.ingList)

    const onSortEnd = (oldIndex, newIndex) => {
        setIngArray((array) => arrayMove(array, oldIndex, newIndex))
    }

    const addIngItem = () => {
        const ingArrayCopy = [...ingArray]
        ingArrayCopy.push({
            amt: '',
            unit: '',
            name: '',
            id: uuidv4()
        })
        setIngArray(ingArrayCopy)
    }

    const updateIngItem = (index,ingItem) => {
        const ingArrayCopy = [...ingArray]
        ingArrayCopy[index] = ingItem
        setIngArray(ingArrayCopy)
    }

    const deleteIngItem = index => {
        const ingArrayCopy = [...ingArray]
        ingArrayCopy.splice(index,index)
        setIngArray(ingArrayCopy)
    }

    useEffect(() => {
        props.updateIngList(ingArray)
    }, [ingArray])

  return (
    <Form.Group className="form-group" controlId="ingredients">
        <Form.Label>Ingredients</Form.Label>
        <SortableList onSortEnd={onSortEnd} className="ing-list" draggedItemClassName="dragged-ing" lockAxis='y'>
            {ingArray.map((item,index) => (
                <EditIng index={index} key={item.id ? item.id : item.name.replace(' ','-')} ing={item} deleteIng={deleteIngItem} updateIng={updateIngItem} />
            ))}
        </SortableList>
        <Form.Group className="form-group buttons" controlId="buttons">
            <Button variant='primary' onClick={addIngItem}>Add Ingredient</Button>
        </Form.Group>
    </Form.Group>
  )
}

export default EditIngList