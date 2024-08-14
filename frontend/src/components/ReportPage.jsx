import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Header from "../components/Header";
import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { ACCESS_TOKEN } from "../constants";

function ReportPage() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();


    const handleReportSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert("You need to be logged in to submit a report.");
            navigate("/login");
            return;

        }
        //for some reason in this function the auth token was not being sent through properly so it has been manually added
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const res = await api.put(`/api/posts/${id}/report/`, null, config);

            if (res.status === 200) {
                alert("Report submitted successfully!");
                navigate(`/post/${id}`);
            } else {
                alert("Failed to submit report. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("An error occurred while submitting the report.");
        }
    };

    return (
        <>
            <Header />
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>Report Post</Typography>
                <form onSubmit={handleReportSubmit}>
                    <Typography>Are you sure you would like to report this post?</Typography>
                    <Button variant="contained" color="primary" type="submit">
                        Submit Report
                    </Button>
                </form>
            </Box>
        </>
    );
}

export default ReportPage;


