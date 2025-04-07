import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../common/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:3000/veterinaria/clientes';

  constructor(private http: HttpClient) {}

  buscarClientes(nombre: string) {
    return this.http.get<Cliente[]>(`${this.baseUrl}?search=${nombre}`);
  }
  

  obtenerMascotasPorCliente(clienteId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/${clienteId}/mascotas`);

  }
  
}
