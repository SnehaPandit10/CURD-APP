import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
        errorMessage: '',
    })

    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmpassword } = formData;
        if (password !== confirmpassword) {
            setFormData({ ...formData, errorMessage: 'Passwords do not match' });
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API}/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            console.log('Response:', await response.text());
            if (response.ok) {
                navigate('/');
            }
            else {
                const data = await response.json();
                setFormData({ ...formData, errorMessage: data.message });
            }
        }
        catch (error) {
            console.error('Error:', error);
            setFormData({ ...formData, errorMessage: 'Something went wrong. Please try again.' })
        }
    };



    return (
        <div className='container mx-auto p-4 max-w-sm shadow-md rounded-lg signup'>
            <h2 className='text-center'>Sign Up</h2>
            <div>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <input className='input-fields'
                        type="text" placeholder='Username' name='username' value={formData.username} onChange={handleInput} required></input>
                    <input className='input-fields'
                        type="email" placeholder='Email' name='email' value={formData.email} onChange={handleInput} required></input>
                    <input className='input-fields'
                        type="password" placeholder='Password' name='password' value={formData.password} onChange={handleInput} required></input>
                    <input className='input-fields'
                        type="password" placeholder='Confirm Password' name='confirmpassword' value={formData.confirmpassword} onChange={handleInput} required></input>
                    <button className='btn btn-primary submit-button'>Submit</button>
                </form>
            </div>
            <p className='text-center'>Already have an account?<a href='/' >LogIn</a></p>
        </div>
    );
}


export default SignUp;