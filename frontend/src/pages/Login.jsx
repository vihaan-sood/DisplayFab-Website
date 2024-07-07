import Form from "../components/Form";
import Header from "../components/Header";

function Login() {
    return <>
     <Header/>
    <div>

        <Form route = "api/token/" method = "login" />
    </div>
    </>
}

export default Login;