import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturacionDto } from 'src/veterinaria/dto-create/create-facturacion.dto/create-facturacion.dto';


export class UpdateFacturacionDto extends PartialType(CreateFacturacionDto) {}
