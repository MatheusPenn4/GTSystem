import React from 'react';
import { Box } from '@mui/material';
import VehicleList from './VehicleList';
import { VehicleProvider } from '../context/VehicleContext';

const Vehicles: React.FC = () => {
  return (
    <VehicleProvider>
      <Box sx={{ flexGrow: 1 }}>
        <VehicleList />
      </Box>
    </VehicleProvider>
  );
};

export default Vehicles;
