import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CitaService {

  private baseUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {}

  crearCita(cita: any) {
    return this.http.post(this.baseUrl, cita);
  }

  getAllCitas() {
    return this.http.get<any[]>(this.baseUrl);
  }

  updateCita(id: string, cita: any) {
    return this.http.put(`${this.baseUrl}/${id}`, cita);
  }
}
