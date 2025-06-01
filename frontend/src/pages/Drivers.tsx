import React from 'react';
import { Box } from '@mui/material';
import DriverList from './DriverList';
import { DriverProvider } from '../context/DriverContext';

const Drivers: React.FC = () => {
  return (
    <DriverProvider>
      <Box sx={{ flexGrow: 1 }}>
        <DriverList />
      </Box>
    </DriverProvider>
  );
};

export default Drivers;
