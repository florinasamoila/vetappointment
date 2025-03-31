import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioPrestadoDto } from 'src/veterinaria/dto-create/create-servicio-prestado.dto/create-servicio-prestado.dto';


export class UpdateServicioPrestadoDto extends PartialType(CreateServicioPrestadoDto) {}
