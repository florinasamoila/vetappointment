import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from 'src/veterinaria/dto-create/create-cliente.dto/create-cliente.dto';


export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
