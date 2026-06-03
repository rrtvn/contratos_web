import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ContratosController } from "./contratos.controller";
import { Contrato, ContratoSchema } from "./contratos.schema";
import { ContratosRepository } from "./contratos.repository";
import { ContratosService } from "./contratos.service";


@Module({
    imports: [MongooseModule.forFeature([
        {
            name: Contrato.name,
            schema: ContratoSchema
        }
    ])
    ],
    controllers: [ContratosController],
    providers: [ContratosService, ContratosRepository]
})

export class ContratosModule {}