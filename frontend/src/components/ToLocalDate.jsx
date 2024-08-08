import { Typography } from "@mui/material";
import React from "react";

export default function ToLocalDate({ dateString }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Typography>{formatDate(dateString)}</Typography>
    );
}