import { IsNotEmpty } from "class-validator";


export class CreateEmpleadoDto {
    @IsNotEmpty()
    rut!: string;

    @IsNotEmpty()
    nombre!: string;

    @IsNotEmpty()
    fechaIngreso!: Date;

    @IsNotEmpty()
    cargo!: string;

    @IsNotEmpty()
    salario!: number;

    @IsNotEmpty()
    fechaNacimiento!: Date;

}