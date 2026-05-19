import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';
import { EmpleadoSchema, Empleado } from './empleados.schema';
import { EmpleadosRepository } from './empleados.repository';

@Module({
  imports: [MongooseModule.forFeature([
    { 
      name: Empleado.name, 
      schema: EmpleadoSchema 
    }
  ])
],
  controllers: [EmpleadosController],
  providers: [EmpleadosService, EmpleadosRepository]
})
export class EmpleadosModule {}
