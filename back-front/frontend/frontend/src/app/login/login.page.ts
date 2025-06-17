// src/app/login/login.page.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ModalController } from '@ionic/angular/standalone';
import { SupportModalComponent } from '../components/support-modal/support-modal.component';
// Importa Router
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  private attempts = 0;
  private readonly maxAttempts = 3;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,           // ← aquí
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^admin@vetappointment\\.com$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^vetAPPointment01$'),
        ],
      ],
    });
  }

  async onSubmit() {
    console.log('🔔 onSubmit disparado', this.loginForm.value);

    if (this.loginForm.get('email')?.hasError('pattern')) {
      const toast = await this.toastCtrl.create({
        message: 'El email debe ser admin@vetappointment.com',
        color: 'warning',
        duration: 3000,
      });
      await toast.present();
      return;
    }

    if (this.loginForm.get('password')?.hasError('pattern')) {
      this.attempts++;
      const restante = this.maxAttempts - this.attempts;
      const toast = await this.toastCtrl.create({
        message: restante > 0
          ? `Contraseña incorrecta. Te quedan ${restante} intento(s).`
          : 'Demasiados intentos fallidos. Contacta con soporte.',
        color: restante > 0 ? 'warning' : 'danger',
        duration: 3000,
      });
      await toast.present();
      if (restante <= 0) this.loginForm.disable();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe(async (ok) => {
      console.log('🔑 auth.login ok=', ok);
      if (ok) {
        console.log('✅ Login correcto, navegando a /tabs');
        const success = await this.toastCtrl.create({
          position: 'middle',
          message: `¡Bienvenido, ${email}!`,
          color: 'success',
          duration: 2000,
        });
        await success.present();

        // Navega con Router, no con NavController
        console.log('🔀 Llamando a router.navigateByUrl(/tabs)');
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      } else {
        const error = await this.toastCtrl.create({
          message: 'Error inesperado al iniciar sesión.',
          color: 'danger',
          duration: 2000,
        });
        await error.present();
      }
    });
  }

  async openSupportModal() {
    const modal = await this.modalCtrl.create({
      component: SupportModalComponent,
    });
    await modal.present();
  }
}
