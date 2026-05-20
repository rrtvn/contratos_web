import { IsNotEmpty } from "class-validator";


export class CreateEmpleadoDto {
    @IsNotEmpty()
    rut!: string;
    @IsNotEmpty()
    primerNombre!: string;
    @IsNotEmpty()
    segundoNombre!: string;
    @IsNotEmpty()
    primerApellido!: string;
    @IsNotEmpty()
    segundoApellido!: string;
    @IsNotEmpty()
    fechaIngreso!: Date;
    @IsNotEmpty()
    cargo!: string;
    @IsNotEmpty()
    titulo!: string;
    @IsNotEmpty()
    edad!: number;
    @IsNotEmpty()
    fechaNacimiento!: Date;

}