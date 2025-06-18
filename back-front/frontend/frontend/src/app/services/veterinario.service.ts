import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Veterinario } from '../common/veterinario';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class VeterinarioService {
  private baseUrl = `${environment.apiUrl}/veterinario`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los veterinarios, opcionalmente filtrados por término de búsqueda
   */
  getAll(search?: string): Observable<Veterinario[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Veterinario[]>(this.baseUrl, { params });
  }

  /**
   * Obtiene un veterinario por su ID
   */
  getById(id: string): Observable<Veterinario> {
    return this.http.get<Veterinario>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea un nuevo veterinario
   */
  create(data: Partial<Veterinario>): Observable<Veterinario> {
    return this.http.post<Veterinario>(this.baseUrl, data);
  }

  /**
   * Actualiza un veterinario existente
   */
  update(id: string, data: Partial<Veterinario>): Observable<Veterinario> {
    return this.http.put<Veterinario>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Elimina un veterinario por su ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export { Veterinario };
