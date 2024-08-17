import React from 'react';
import { Box } from '@mui/material';

function Centering({ children }) {
  return (
    <Box
      sx={{
        width: '70%',      
        mx: 'auto',       
        mt: 4,               
        mb: 4,               
      }}
    >
      {children}
    </Box>
  );
}

export default Centering;