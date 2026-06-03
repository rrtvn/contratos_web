import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type ContratoDocument = HydratedDocument<Contrato>;

@Schema({
    timestamps: true,
})

export class Contrato {

    @Prop({ required: true, unique: true })
    empleadoRut!: string;
    @Prop({ required: true })
    fullName!: string;
    @Prop({ required: true })
    fechaInicio!: Date;
    @Prop({ required: true })
    cargo!: string;
    // @Prop({ required: true })
    // titulo!: string;
    // // @Prop({ required: true })
    // edad!: number;
    // // @Prop({ required: true })
    // fechaNacimiento!: Date;
    @Prop({ required: true })
    tipoContrato!: string;
    @Prop({ required: true })
    sueldoBase!: number;
    @Prop({ required: true })
    jornada!: string;
    @Prop({ required: true })
    lugarTrabajo!: string;
    @Prop({ required: false })
    anexos!: string;
    @Prop({ required: true })
    departamento!: string;
}

export const ContratoSchema = SchemaFactory.createForClass(Contrato);
