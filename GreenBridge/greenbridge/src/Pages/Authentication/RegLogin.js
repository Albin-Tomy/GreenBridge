import React, { useState } from 'react'
import Login from './Login';
import Register from './Register';
import trees from '../../assets/trees.jpg';


function RegLogin() {

    const [isLogin,setIslogin]=useState(true) 
    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-left">
                    <img src={trees} alt="trees" />
                </div>

            {isLogin ? <Login setIslogin={setIslogin}  /> : <Register setIslogin={setIslogin} />}
            </div>
        </div>
    )
}

export default RegLogin;