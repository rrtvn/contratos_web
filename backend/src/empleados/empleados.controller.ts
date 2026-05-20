import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { Empleado } from './empleados.schema';

@Controller('empleados')
export class EmpleadosController {

    constructor(private readonly empleadosService: EmpleadosService) { }

    @Post()
    crearEmpleado(@Body() empleado: Empleado) {
        return this.empleadosService.crearEmpleado(empleado);
    }

    @Get()
    obtenerEmpleado() {
        return this.empleadosService.obtenerTodos();
    }
}
