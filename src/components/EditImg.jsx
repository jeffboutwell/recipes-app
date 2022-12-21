import React from 'react'
import {Image } from 'react-bootstrap'

const handleDelete = (e) => {
    console.log('handle delete')
}

function EditImg(props) {
  return (
      <div className='editImgThumb'>
        {props.enableDelete && props.enableDelete > 0 (
          <i className="fa-solid fa-trash-can" onClick={handleDelete}></i>
        )}
        <Image fluid src={props.url+'&tr=w-200,h-200'}></Image>
      </div>
  )
}
export default EditImg