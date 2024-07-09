import { useState, useEffect } from "react";
import api from "../api"


import Header from "../components/Header";


function ListView() {

    const [posts, setPosts] = useState([]);

    useEffect( ()=>{getPosts();},[]    )


    const getPosts = () => {
        api
        .get("/api/posts/")
        .then((res) => res.data)
        .then((data) => {setPosts(data);console.log(data)})
        .catch((err) => alert(err)); };

    

    return (
        <>
            <Header />
            <div>
                <h1>
                    ListView
                </h1>
            </div>
        </>
    );
};

export default ListView;