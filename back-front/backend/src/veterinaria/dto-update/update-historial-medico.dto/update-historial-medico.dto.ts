import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialMedicoDto } from 'src/veterinaria/dto-create/create-historial-medico.dto/create-historial-medico.dto';


export class UpdateHistorialMedicoDto extends PartialType(CreateHistorialMedicoDto) {}
