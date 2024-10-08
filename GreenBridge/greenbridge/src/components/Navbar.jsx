import React from 'react'
import './Navbar.css'
import logo from '../assets/logomain.png'
 import cart from '../assets/cart.png'
import user from '../assets/user.png'

function Navbar() {
  return (
    <div className='navbar-container'>
        <div className='left-section'>
            <div className="logo">
                <img src={logo} alt="logo" />
                <h2><b>WineHaus</b></h2>
            </div>
        </div>

        <div className='right-section'>
            <div className="nav-links">
                <div className="nav-link">
                    <a href="#"><b>Home</b></a>
                </div>
                <div className="nav-link">
                    <a href="#"><b>Products</b></a>
                </div>
                <div className="nav-link">
                    <a href="#"><b>Accessories</b></a>
                </div>

            </div>

            <div className="icon-links">
                <div className="icon">
                    <img src={cart} alt="cart" />
                </div>
                <div className="icon">
                    <img src={user} alt="user" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar