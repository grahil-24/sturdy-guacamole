import React, { useState } from "react";
import '../styles/login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        //credentials true required for storing the refreshtoken sent by the backend to be stored in httponly cookie
        try {
            const response = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
            }

            const data = await response.json();
            onLogin(data.user);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleLogin} className={"loginForm"}>
            <h1>Login</h1>
            <div className={"input"}>
                <div className={"input-label"}>
                    <label htmlFor="email">Email</label>
                </div>
                <div className={"input-box"}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
            </div>
            <div className={"input"}>
                <div className={"input-label"}>
                    <label htmlFor="password">Password</label>
                </div>
                <div className={"input-box"}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>
            </div>
            <button type="submit">Login</button>
            {error && <p style={{ color: "red"}}>{error}</p>}
        </form>
    );
};

export default Login;
