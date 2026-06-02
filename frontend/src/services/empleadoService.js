import axios from 'axios';
import { API_URL } from '../config';

class EmpleadoService {

    async getEmpleados() {
        try {
            const response = await axios.get(`${API_URL}/empleados`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                // params: {
                //     key: API_KEY,
                // }
            });
            return response.data.results;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default new EmpleadoService();