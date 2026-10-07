import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LogIn = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await fetch(`${process.env.REACT_APP_API}/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                navigate("/tasks");
            } else {
                setErrorMessage(data.message || "Login failed.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Cannot reach the server. Check that the backend is running.");
        }
    };

    return (
        <div className="auth-wrap">
            <div className="auth-card">
                <h2>Log in</h2>
                <p className="sub">Pick up where you left off.</p>
                <form onSubmit={handleSubmit}>
                    <input className="input-fields" type="text" placeholder="Username"
                        name="username" value={formData.username} onChange={handleInput} required />
                    <input className="input-fields" type="password" placeholder="Password"
                        name="password" value={formData.password} onChange={handleInput} required />
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                    <button type="submit" className="btn btn-primary">Log in</button>
                </form>
                <p className="switch">Don't have an account?<Link to="/signup/">Sign up</Link></p>
            </div>
        </div>
    );
};

export default LogIn;