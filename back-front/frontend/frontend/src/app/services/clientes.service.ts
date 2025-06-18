import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../common/cliente';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
 
  private baseUrlProd = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  buscarClientes(nombre: string) {
    return this.http.get<Cliente[]>(`${this.baseUrlProd}?search=${nombre}`);
  }

  obtenerMascotasPorCliente(clienteId: string) {
    return this.http.get<any[]>(`${this.baseUrlProd}/${clienteId}/mascotas`);
  }

  /** Nuevo método para añadir una mascota a un cliente existente */
  agregarMascota(clienteId: string, mascota: any) {
    return this.http.post<any>(`${this.baseUrlProd}/${clienteId}/mascota`, mascota);
  }
}
