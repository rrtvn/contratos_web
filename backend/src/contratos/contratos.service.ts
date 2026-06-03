import { Injectable } from "@nestjs/common";
import { ContratosRepository } from "./contratos.repository";


@Injectable()
export class ContratosService {

    constructor(
        private readonly contratosRepository: ContratosRepository,
    ) { }

    async crearContrato(createContratoDto: any) {
        // VALIDAR SI EXISTE UN CONTRATO CON EL MISMO RUT
        return this.contratosRepository.create(createContratoDto);
    }
    async obtenerTodos() {
        return this.contratosRepository.findAll();
    }
    async findById(id: string) {
        return this.contratosRepository.findById(id);
    }
}