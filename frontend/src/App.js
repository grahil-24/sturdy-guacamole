import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRouteRedir";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                //check the validity of user session, by checking the validity of refreshtoken
                //if valid -> new accesstoken generated and reroute to profile page
                //else -> redirect user to login page
                const response = await fetch("http://localhost:3001/auth/me", {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/profile" />} />
                <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
