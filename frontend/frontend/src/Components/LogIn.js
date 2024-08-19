import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        errorMessage: '',
    })
    const navigate = useNavigate();

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();
        try {

            const response = await fetch(`${process.env.REACT_APP_API}/login/`, {
                method: 'POST',
                headers: {
                    // 'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                navigate("/tasks");
            } else {
                const data = await response.json();
                throw data;
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='container shadow-md rounded-lg login'>
            <h2 className='text-center'>Log In</h2>
            <div>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <input
                        className='input-fields'
                        type="username"
                        placeholder='Username'
                        name='username'
                        value={formData.username}
                        onChange={handleInput}
                        required></input>
                    <input
                        className='input-fields'
                        type="password"
                        placeholder='Password'
                        name='password'
                        value={formData.password}
                        onChange={handleInput}
                        required></input>
                    <button className='btn btn-primary submit-button'>Submit</button>
                </form>
                {formData.errorMessage && <p style={{ color: "red", textAlign: "center" }}>Error: {formData.errorMessage}</p>}

            </div>
            <p className='text-center'>Don't have an account? <a href='/signup/' >SignUp</a></p>
        </div>
    );
}


export default LogIn;