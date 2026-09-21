
import axios from 'axios';
import { Platform } from 'react-native';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;
const apiUrl =
    Platform.OS === 'android'
        ? configuredApiUrl?.replace('://localhost', '://10.0.2.2')
        : configuredApiUrl;

export const api = axios.create({
    baseURL: apiUrl?.replace(/\/+$/, ''),
    headers: {
        'Content-Type': 'application/json',
    },
});
