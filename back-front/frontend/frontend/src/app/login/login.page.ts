// src/app/login/login.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      const warning = await this.toastCtrl.create({
        message: 'Por favor completa todos los campos correctamente',
        color: 'warning',
        duration: 2000
      });
      await warning.present();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe(async ok => {
      if (ok) {
        const success = await this.toastCtrl.create({
          message: `¡Bienvenido, ${email}!`,
          color: 'success',
          duration: 2000
        });
        await success.present();
        this.navCtrl.navigateRoot('/tabs', { replaceUrl: true });
      } else {
        const error = await this.toastCtrl.create({
          message: 'Credenciales inválidas. Para recuperar tu contraseña, contacta a soporte.',
          color: 'danger',
          duration: 2000
        });
        await error.present();
      }
    });
  }
}
