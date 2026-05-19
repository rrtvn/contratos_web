import { InjectModel } from "@nestjs/mongoose";
import { Empleado, EmpleadoDocument } from "./empleados.schema";
import { Model } from "mongoose";


export class EmpleadosRepository {
    constructor(
        @InjectModel(Empleado.name)
        private readonly empleadosModel: Model<EmpleadoDocument>,
    ) {}
    async create(data: Partial<Empleado>){
        return this.empleadosModel.create(data);
    }
    async findAll(){
        return this.empleadosModel.find().lean();
    }
}