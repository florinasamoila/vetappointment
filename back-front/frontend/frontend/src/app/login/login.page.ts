// src/app/login/login.page.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ModalController } from '@ionic/angular/standalone';
import { SupportModalComponent } from '../components/support-modal/support-modal.component';
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
    private navCtrl: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          // Sólo permitimos este email exacto
          Validators.pattern('^admin@vetappointment\\.com$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          // Sólo permitimos esta contraseña exacta
          Validators.pattern('^vetAPPointment01$'),
        ],
      ],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  async onSubmit() {
    console.log('🔔 onSubmit disparado', this.loginForm.value);
    // Primero validamos el email
    if (this.emailControl?.hasError('pattern')) {
      const toast = await this.toastCtrl.create({
        message: 'El email debe ser admin@vetappointment.com',
        color: 'warning',
        duration: 3000,
      });
      await toast.present();
      return;
    }

    // Ahora manejamos intentos de contraseña
    if (this.passwordControl?.hasError('pattern')) {
      this.attempts++;
      if (this.attempts >= this.maxAttempts) {
        const toast = await this.toastCtrl.create({
          message: 'Demasiados intentos fallidos. Contacta con soporte.',
          color: 'danger',
          duration: 4000,
        });
        await toast.present();
        // Opcional: deshabilitar el formulario tras demasiados intentos
        this.loginForm.disable();
      } else {
        const restante = this.maxAttempts - this.attempts;
        const toast = await this.toastCtrl.create({
          message: `Contraseña incorrecta. Te quedan ${restante} intento(s).`,
          color: 'warning',
          duration: 3000,
        });
        await toast.present();
      }
      return;
    }

    // Si llegamos aquí, email y contraseña cumplen patrón exacto
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe(async (ok) => {
      console.log('🔑 auth.login ok=', ok);
    
      if (ok) {
        console.log('✅ Login correcto, navegando a /tabs');
        const toast = await this.toastCtrl.create({
          position: 'middle',
          message: `¡Bienvenido, ${email}!`,
          color: 'success',
          duration: 2000,
        });
        await toast.present();
        this.navCtrl.navigateByUrl('/tabs', { replaceUrl: true });
      } else {
        console.log('❌ auth.login devolvió false');
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
