import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private apiUrl = 'http://localhost:3000/veterinaria/citas';

  constructor(private http: HttpClient) {}

  crearCita(cita: any) {
    return this.http.post(this.apiUrl, cita);
  }

  getAllCitas() {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateCita(id: string, cita: any) {
    return this.http.put(`http://localhost:3000/veterinaria/citas/${id}`, cita);
  }
}
