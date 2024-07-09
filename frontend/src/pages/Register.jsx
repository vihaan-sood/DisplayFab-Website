import Form from "../components/Form";
import Header from "../components/Header";

function Register() {
    return (
        <>
    <Header/>
    <div>
        <Form route = "api/register/" method = "register" />
    </div></>
    );
};

export default Register;