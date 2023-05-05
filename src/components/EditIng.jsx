import {useState,useEffect} from 'react'
import {Form} from 'react-bootstrap'
import { SortableItem, SortableKnob } from 'react-easy-sort'

function EditIng(props) {
    const [amt,setAmt] = useState(props.ing.amt)
    const [unit,setUnit] = useState(props.ing.unit)
    const [name,setName] = useState(props.ing.name)
    const [slugName,setSlugName] = useState(props.ing.name.replace(' ','-'))

    const deleteSelf = () => {
        props.deleteIng(props.index)
    }

    useEffect(() => {
        props.updateIng(
            props.index,
            {
                amt,
                unit,
                name
            }
        )
    },[amt,unit,name])

  return (
    <SortableItem>
        <Form.Group>
            <SortableKnob><i className="fa-solid fa-sort"></i></SortableKnob>
            <Form.Control className='ingListItem amt' type="text" placeholder="amount" value={amt} onChange={e => setAmt(e.target.value)} />
            <Form.Control className='ingListItem unit' type="text" placeholder="unit" value={unit} onChange={e => setUnit(e.target.value)} />
            <Form.Control className='ingListItem name' type="text" placeholder="name" value={name} onChange={e => setName(e.target.value)} />
            <i className="fa-solid fa-trash-can" onClick={deleteSelf}></i>
        </Form.Group>
    </SortableItem>
  )
}

export default EditIng