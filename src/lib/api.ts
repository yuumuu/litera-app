import axios from 'axios';

const api = axios.create({
    baseURL: 'http://litera-api.test/api/v1',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;
