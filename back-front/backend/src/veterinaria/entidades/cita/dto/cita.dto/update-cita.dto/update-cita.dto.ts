import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from 'src/veterinaria/entidades/cita/dto/cita.dto/create-cita.dto/create-cita.dto';

export class UpdateCitaDto extends PartialType(CreateCitaDto) {}
