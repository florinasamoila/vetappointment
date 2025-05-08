// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const loggedIn = await firstValueFrom(this.auth.isLoggedIn$);
    if (!loggedIn) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return false;
    }
    return true;
  }
}
