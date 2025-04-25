import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsDateString, IsMongoId, IsInt } from 'class-validator';

export class MascotaDto {
  @IsOptional()
  @IsMongoId()
  readonly _id?: string;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly especie: string;

  @IsString()
  @IsNotEmpty()
  readonly raza: string;

  @IsInt()
  @Min(0)
  readonly edad: number;  // Ensure edad is an integer

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
  readonly cliente: string;  // The client ID must be valid and not empty
}
