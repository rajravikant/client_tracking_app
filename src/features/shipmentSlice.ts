import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Shipment } from '../types/Shipment';


export interface ShipmentsState {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
}

const initialState: ShipmentsState = {
  shipments: [],
  loading: false,
  error: null,
};

// TODO:improve error handling and update ui

// TODO:explore mongodb geolocation queries for location based queries



export const fetchShipments = createAsyncThunk('shipments/fetch', async () => {
  const response = await axios.get<Shipment[]>(`${import.meta.env.VITE_API_URL}/api/shipments`);
  return response.data;
});

export const addShipment = createAsyncThunk('shipments/add', async (shipment: Shipment) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shipment`, shipment);
  return response.data;
});

export const updateShipmentLocation = createAsyncThunk(
  'shipments/updateLocation',
  async ({ id, location }: { id: string; location: string }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shipment/${id}/update-location`,
      { location }
    );
    return response.data;
  }
);

export const getShipmentETA = createAsyncThunk('shipments/getETA', async (id: string) => {
  const response = await axios.get<{ eta: string }>(`${import.meta.env.VITE_API_URL}/api/shipment/${id}/eta`);
  return response.data.eta;
});

export const getShipmentById = createAsyncThunk('shipments/getById', async (id: string) => {
  const response = await axios.get<Shipment>(`${import.meta.env.VITE_API_URL}/api/shipment/${id}`);
  return response.data;
});




const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action: PayloadAction<Shipment[]>) => {
        state.loading = false;
        state.shipments = action.payload;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shipments';
      })
      .addCase(addShipment.fulfilled, (state, action: PayloadAction<Shipment>) => {
        state.shipments.push(action.payload);
      })
      .addCase(addShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add shipment';
      })
  },
});

export default shipmentsSlice.reducer;
