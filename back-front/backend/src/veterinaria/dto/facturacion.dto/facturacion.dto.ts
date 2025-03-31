import { CitaDto } from "../cita.dto/cita.dto";


export class FacturacionDto {
  _id: string;
  cita: CitaDto;          
  cantidad: number;
  fechaPago: Date;
  metodoPago: string;
}

  