import { IsNotEmpty } from "class-validator";


export class CreateEmpleadoDto {
    @IsNotEmpty()
    empleadoRut!: string;
    @IsNotEmpty()
    fullName!: string;
    @IsNotEmpty()
    fechaInicio!: Date;
    @IsNotEmpty()
    cargo!: string;
    // titulo!: string;
    // @IsNotEmpty()
    // edad!: number;
    // @IsNotEmpty()
    // fechaNacimiento!: Date;
    @IsNotEmpty()
    tipoContrato!: string;
    @IsNotEmpty()
    sueldoBase!: number;
    @IsNotEmpty()
    jornada!: string;
    @IsNotEmpty()
    lugarTrabajo!: string;
    @IsNotEmpty()
    anexos!: string;
    @IsNotEmpty()
    departamento!: string;

}