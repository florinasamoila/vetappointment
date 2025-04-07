import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:3000/veterinaria/citas';

  constructor(private http: HttpClient) {}

  crearCita(cita: any) {
    return this.http.post(this.apiUrl, cita);
  }
}
