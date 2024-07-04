import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const formName = method === "login" ? "Login" : "Register"


    const handleSubmit = async (e) => {

        setLoading(true);
        e.preventDefault();


        try {
            const res = await api.post(route, { username, password })


            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else { // for register
                navigate("/login")
            }



        }
        catch (error) {
            alert(error)
        }

        finally {
            setLoading(false)
        }


    }

    return (
        <form onSubmit={handleSubmit} className="form-container">

            <h1>{formName}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            ></input>

            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            ></input>

            <button
                className="form-button"
                type="submit"

            >
                {formName}
            </button>


        </form>
    )
}

export default Form;
