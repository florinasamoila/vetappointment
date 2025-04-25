// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'vetapp_user';
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasStoredUser());
  private _userEmail  = new BehaviorSubject<string|null>(this.getStoredEmail());

  /** Exponen observables para quienes se suscriban */
  get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn.asObservable();
  }
  get userEmail$(): Observable<string|null> {
    return this._userEmail.asObservable();
  }

  /** Simula un login “exitoso” con email/password y lo persiste */
  login(email: string, password: string): Observable<boolean> {
    if (email && password) {
      localStorage.setItem(this.STORAGE_KEY, email);
      this._userEmail.next(email);
      this._isLoggedIn.next(true);
      return of(true);
    }
    return of(false);
  }

  /** Cierra la sesión y limpia el almacenamiento */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._userEmail.next(null);
    this._isLoggedIn.next(false);
  }

  /** Comprueba si hay un usuario guardado */
  private hasStoredUser(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  /** Recupera el email registrado en localStorage */
  private getStoredEmail(): string|null {
    return localStorage.getItem(this.STORAGE_KEY);
  }
}
