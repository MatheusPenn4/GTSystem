import React from 'react';
import { Grid, Box } from '@mui/material';

interface DashboardCardWrapperProps {
  children: React.ReactNode;
}

const DashboardCardWrapper: React.FC<DashboardCardWrapperProps> = ({ children }) => {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        sx={{
          width: '100%',
          mx: 0,
          animation: 'fadeIn 0.5s ease-in-out',
        }}
      >
        {React.Children.map(children, (child, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{
              animation: `slideIn ${0.2 + index * 0.1}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
              p: { xs: 1, sm: 1.5 },
            }}
          >
            {child}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardCardWrapper;
