import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";


function ClickableTag({ keyword, onSearch }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/listview", { state: { query: keyword } });
        onSearch(keyword);

    };

    return (
        <div className="clickable-tag" onClick={handleClick}>
            {keyword}
        </div>
    );
}

ClickableTag.propTypes = {
    keyword: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default ClickableTag;
