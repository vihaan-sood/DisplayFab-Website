import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "@mui/material";


function ClickableTag({ keyword, onSearch }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/listview", { state: { query: keyword } });
        onSearch(keyword);
        

    };

    return (
        <>
       
                <Button onClick={handleClick} variant="outlined">{keyword}</Button>

           
        </>
    );
}

ClickableTag.propTypes = {
    keyword: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default ClickableTag;
