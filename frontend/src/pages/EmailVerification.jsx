import { useState } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Form.css";

function EmailVerification() {
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/api/verifyemail/", {
                email: email,
                verification_code: verificationCode,
            });

            if (response.status === 200) {
                alert("Email verified successfully!");
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError("Invalid verification code. Please try again.");
            } else {
                setError("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Verify Email</h1>
            <p>Please enter the verification code sent to your email: {email}</p>
            <input
                className="form-input"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Verification Code"
                required
            />
            {error && <p className="error">{error}</p>}
            <button className="form-button" type="submit">
                Verify
            </button>
        </form>
    );
}

export default EmailVerification;
