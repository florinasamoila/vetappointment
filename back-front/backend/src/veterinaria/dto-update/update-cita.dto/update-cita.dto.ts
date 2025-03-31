import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from 'src/veterinaria/dto-create/create-cita.dto/create-cita.dto';


export class UpdateCitaDto extends PartialType(CreateCitaDto) {}
