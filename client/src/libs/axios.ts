
import axios from 'axios';
import { Platform } from 'react-native';



export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
