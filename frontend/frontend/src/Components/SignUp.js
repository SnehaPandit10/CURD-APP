import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: "", email: "", password: "", confirmpassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const { username, email, password, confirmpassword } = formData;
    if (password !== confirmpassword) {
        setErrorMessage("Passwords do not match.");
        return;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_API}/signup/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json().catch(() => ({}));
        if (response.ok) {
            navigate("/");
        } else {
            setErrorMessage(data.message || `Sign up failed (error ${response.status}).`);
        }
    } catch (error) {
        console.error(error);
        setErrorMessage("Cannot reach the server. Check that the backend is running.");
    }
};

    return (
        <div className="auth-wrap">
            <div className="auth-card">
                <h2>Create account</h2>
                <p className="sub">Start tracking your tasks.</p>
                <form onSubmit={handleSubmit}>
                    <input className="input-fields" type="text" placeholder="Username"
                        name="username" value={formData.username} onChange={handleInput} required />
                    <input className="input-fields" type="email" placeholder="Email"
                        name="email" value={formData.email} onChange={handleInput} required />
                    <input className="input-fields" type="password" placeholder="Password"
                        name="password" value={formData.password} onChange={handleInput} required />
                    <input className="input-fields" type="password" placeholder="Confirm password"
                        name="confirmpassword" value={formData.confirmpassword} onChange={handleInput} required />
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                    <button type="submit" className="btn btn-primary">Create account</button>
                </form>
                <p className="switch">Already have an account?<Link to="/">Log in</Link></p>
            </div>
        </div>
    );
};

export default SignUp;