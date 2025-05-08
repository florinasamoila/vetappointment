import { PartialType } from '@nestjs/mapped-types';
import { CreateVeterinarioDto } from 'src/veterinaria/entidades/veterinario/dto/create-veterinario.dto/create-veterinario.dto';


export class UpdateVeterinarioDto extends PartialType(CreateVeterinarioDto) {}
