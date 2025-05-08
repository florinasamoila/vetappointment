import { PartialType } from '@nestjs/mapped-types';
import { CreateMascotaDto } from 'src/veterinaria/entidades/mascota/dto/create-mascota.dto/create-mascota.dto';

export class UpdateMascotaDto extends PartialType(CreateMascotaDto) {}
