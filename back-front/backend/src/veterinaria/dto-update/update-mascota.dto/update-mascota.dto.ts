import { PartialType } from '@nestjs/mapped-types';
import { CreateMascotaDto } from 'src/veterinaria/dto-create/create-mascota.dto/create-mascota.dto';


export class UpdateMascotaDto extends PartialType(CreateMascotaDto) {}
