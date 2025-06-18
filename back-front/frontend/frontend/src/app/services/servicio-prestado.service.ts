import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicioPrestado } from '../common/servicio-prestado';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ServicioPrestadoService {
  private baseUrl = `${environment.apiUrl}/servicio-prestado`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los servicios prestados, opcionalmente filtrados por término de búsqueda
   */
  getAll(search?: string): Observable<ServicioPrestado[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ServicioPrestado[]>(this.baseUrl, { params });
  }

  /**
   * Obtiene un servicio prestado por su ID
   */
  getById(id: string): Observable<ServicioPrestado> {
    return this.http.get<ServicioPrestado>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea un nuevo servicio prestado
   */
  create(data: Partial<ServicioPrestado>): Observable<ServicioPrestado> {
    return this.http.post<ServicioPrestado>(this.baseUrl, data);
  }

  /**
   * Actualiza un servicio prestado existente
   */
  update(
    id: string,
    data: Partial<ServicioPrestado>
  ): Observable<ServicioPrestado> {
    return this.http.put<ServicioPrestado>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Elimina un servicio prestado por su ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
export { ServicioPrestado };
