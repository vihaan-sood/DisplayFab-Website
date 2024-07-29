import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";

function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        const formData = {
            username,
            email,
            password,
            password2,
            first_name: firstName,
            last_name: lastName
        };

        try {
            await api.post("/api/register/", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            navigate("/login");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const errorMessages = [];
                    for (const key in error.response.data) {
                        if (Array.isArray(error.response.data[key])) {
                            error.response.data[key].forEach((message) => {
                                errorMessages.push(`${key}: ${message}`);
                            });
                        } else {
                            errorMessages.push(`${key}: ${error.response.data[key]}`);
                        }
                    }
                    alert(errorMessages.join("\n"));
                } else {
                    alert("An unexpected error occurred.");
                }
            } else {
                alert("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Register</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                className="form-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
            />
            <input
                className="form-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <input
                className="form-input"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirm Password"
                required
            />
            {loading && <div>Loading...</div>}
            <button className="form-button" type="submit">
                Register
            </button>
        </form>
    );
}

export default RegisterForm;
