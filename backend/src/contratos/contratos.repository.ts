import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Contrato, ContratoDocument } from "./contratos.schema";


export class ContratosRepository {
    constructor(
        @InjectModel(Contrato.name)
        private readonly contratosModel: Model<ContratoDocument>,
    ) {}

    async create(data: Partial<Contrato>){
        console.log(data);
        return this.contratosModel.create(data);
    }
    async findAll(): Promise<Contrato[]> {
        console.log(await this.contratosModel.find());
        return await this.contratosModel.find();
    }
    async findById(id: string): Promise<Contrato | null> {
        return await this.contratosModel.findById(id);
    }
    async findByRut(rut: string): Promise<Contrato | null> {
        return await this.contratosModel.findOne({ rutEmpleado: rut }).lean();
    }
    
}