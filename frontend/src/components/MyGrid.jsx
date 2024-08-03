import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";


function MyGrid({ items, columns }) {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {items.map((item, index) => (
                    <Grid item xs={12 / columns} sm={6} md={4} lg={3} xl={2} key={index}>
                        <Paper elevation={3} sx={{ padding: 2 }}>
                            <Typography>{item}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
export default MyGrid;
