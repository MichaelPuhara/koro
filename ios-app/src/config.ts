import { Platform } from 'react-native';

// When running on iOS Simulator, you need to use your Mac's IP address
// To find your Mac's IP: System Preferences > Network, or run: ipconfig getifaddr en0
// Common local IP addresses: 192.168.1.x, 10.0.0.x, 172.16.x.x

// CHANGE THIS to your Mac's local IP address when running on iOS Simulator
const LOCAL_IP = '192.168.1.100'; // Replace with your actual IP

// Use localhost for Android emulator, local IP for iOS Simulator
const API_BASE_URL = Platform.select({
  ios: `http://${LOCAL_IP}:8000`,
  android: 'http://10.0.2.2:8000', // Android emulator uses 10.0.2.2 for localhost
  default: 'http://localhost:8000',
});

export const API_ENDPOINTS = {
  POST_AUDIO: `${API_BASE_URL}/post-audio`,
  RESET: `${API_BASE_URL}/reset`,
  HEALTH: `${API_BASE_URL}/health`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
