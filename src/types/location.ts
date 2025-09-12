// src/types/location.ts

export interface NigerianState {
    id: string;
    name: string;
}

export interface NigerianCity {
    id: string;
    name: string;
    state: string;
}