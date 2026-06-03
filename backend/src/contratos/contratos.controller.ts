import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Contrato } from "./contratos.schema";
import { ContratosService } from "./contratos.service";


@Controller('contratos')
export class ContratosController {

    constructor(private readonly contratosService: ContratosService) { }

    @Post('create')
    crearContrato(@Body() contrato: Contrato) {
        return this.contratosService.crearContrato(contrato);
    }

    @Get('/getAll')
    obtenerContratos() {
        return this.contratosService.obtenerTodos();
    }
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.contratosService.findById(id);
    }

}