import React from 'react'
import './Menubox.css'

function Menubox({text,action,menu,parentMenu}) {
    const handleMenuClick=()=>{
        action(text)
         console.log("clicked")

    }
  return (

    <div className='menubox-container' onClick={handleMenuClick} style={{ border: text === parentMenu ? '2px solid #07a8b0' : '1px solid black',
    boxShadow: text === parentMenu ? '0px 0px 5px 5px rgba(7, 168, 176, 0.3)' : ''}}>
      <div className='menubox-text'>
            {text}
      </div>
    </div>
  )
}

export default Menubox