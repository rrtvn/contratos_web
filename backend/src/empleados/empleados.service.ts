import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Empleado } from './empleados.schema';
import { EmpleadosRepository } from './empleados.repository';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';

@Injectable()
export class EmpleadosService {

    constructor(
        private readonly empleadoRepository: EmpleadosRepository,
    ) { }

    async crearEmpleado(createEmpleadoDto: CreateEmpleadoDto) {
        // VALIDAR SI EXISTE UN EMPLEADO CON EL MISMO RUT
        return this.empleadoRepository.create(createEmpleadoDto);
    }

    async obtenerTodos() {
        return this.empleadoRepository.findAll();
    }
}

