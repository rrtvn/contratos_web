import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmpleadoDocument = HydratedDocument<Empleado>;

@Schema({
    timestamps: true,
})
export class Empleado {

    @Prop({ required: true, unique: true })
    rut!: string;
    @Prop({ required: true, unique: true })
    primerNombre!: string;
    @Prop({ required: true, unique: true })
    segundoNombre!: string;
    @Prop({ required: true, unique: true })
    primerApellido!: string;
    @Prop({ required: true, unique: true })
    segundoApellido!: string;
    @Prop({ required: true })
    fechaIngreso!: Date;
    @Prop({ required: true })
    cargo!: string;
    @Prop({ required: true })
    titulo!: string;
    @Prop({ required: true })
    edad!: number;
    @Prop({ required: true })
    fechaNacimiento!: Date;

}

export const EmpleadoSchema = SchemaFactory.createForClass(Empleado);

