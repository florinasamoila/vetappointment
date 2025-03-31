import { PartialType } from '@nestjs/mapped-types';
import { CreateVeterinarioDto } from 'src/veterinaria/dto-create/create-veterinario.dto/create-veterinario.dto';


export class UpdateVeterinarioDto extends PartialType(CreateVeterinarioDto) {}
