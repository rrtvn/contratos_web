
import { types } from './types';

const cargarEmpleados = (empleados) => ({
    type: types.CARGAR_EMPLEADOS,
    payload: empleados
})

export const startCargarEmpleados = () => async (dispatch) => {

    try {
        const empleados = await empleadosService.getEmpleados();
        if (empleados) {
            dispatch(cargarEmpleados(empleados));
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}