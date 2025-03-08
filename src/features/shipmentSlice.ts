import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Shipment, ShipmentFormData } from '../types/Shipment';

const API_URL:string = import.meta.env.VITE_API_URL+"/api";

export interface ShipmentsState {
  shipments: Shipment[];
  loading: boolean;
  currentShipment : Shipment | null;
  error: string | null;
}

const initialState: ShipmentsState = {
  shipments: [],  
  loading: false,
  error: null,
  currentShipment : null
};




export const fetchShipments = createAsyncThunk('shipments/fetch', async () => {
  const response = await axios.get<Shipment[]>(`${API_URL}/shipments`);
  return response.data;
});

export const addShipment = createAsyncThunk('shipments/add', async (shipment: ShipmentFormData) => {
  const response = await axios.post(`${API_URL}/shipment`, shipment);
  return response.data;
  
});

export const updateShipmentLocation = createAsyncThunk(
  'shipments/updateLocation',
  async ({ id, longitude,latitude }: { id: string;  longitude : number , latitude : number }) => {
   
    const currentLocation = {
      type: 'Point',
      coordinates: [longitude,latitude]
    }
     const response = await axios.post(
      `${API_URL}/shipment/${id}/update-location`,
      { location : currentLocation }
    );
    return response.data;
    
  }
);

export const getShipmentETA = createAsyncThunk('shipments/getETA', async (id: string) => {
  const response = await axios.get<{ eta: string }>(`${API_URL}/shipment/${id}/eta`);
  return response.data.eta;
});

export const getShipmentById = createAsyncThunk('shipments/getById', async (id: string) => {
  const response = await axios.get<Shipment>(`${API_URL}/shipment/${id}`);
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
      .addCase(addShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShipment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add shipment';
      })
      .addCase(getShipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
      })
      .addCase(getShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shipment';
      })
  },
});

export default shipmentsSlice.reducer;
