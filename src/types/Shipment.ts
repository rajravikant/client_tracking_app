export type Shipment = {
    _id ?: string;
    containerId: string;
    currentLocation: {
        longitude: number;
        latitude: number;
    };
    route: Array<{
        longitude: number;
        latitude: number;
    }>;
    currentETA?: string;
    status?: 'Pending' | 'In Transit' | 'Delivered';
    createdAt?: string;
    updatedAt?: string;
};


