// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const loggedIn = await firstValueFrom(this.auth.isLoggedIn$);
    if (loggedIn) {
      return true;
    }
    // Devuelves la UrlTree, no haces router.navigateByUrl aquí
    return this.router.parseUrl('/login');
  }
}
