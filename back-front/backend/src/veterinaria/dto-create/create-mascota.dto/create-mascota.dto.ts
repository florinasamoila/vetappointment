import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsDateString, IsMongoId } from 'class-validator';

export class CreateMascotaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly especie: string;

  @IsString()
  @IsNotEmpty()
  readonly raza: string;

  @IsNumber()
  @Min(0)
  readonly edad: number;

  @IsString()
  @IsNotEmpty()
  readonly sexo: string;

  @IsString()
  @IsNotEmpty()
  readonly color: string;

  @IsNumber()
  @Min(0)
  readonly peso: number;

  @IsString()
  @IsOptional()
  readonly caracteristicas?: string;

  @IsDateString()
  @IsOptional()
  readonly fechaNacimiento?: Date;

  @IsMongoId()
  @IsNotEmpty()
  readonly cliente: string;
}

  