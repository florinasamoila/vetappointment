// src/app/components/header/header.component.ts
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonIcon,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { helpCircle, personCircle, logOut, close } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header',
  encapsulation: ViewEncapsulation.None, // ← DESACTIVAMOS encapsulación
  imports: [
    IonHeader,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonButtons,
    IonButton,
    IonIcon,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /** Ahora esto es un string normal */
  @Input() titulo: string = '';

  /** Email del usuario conectado */
  userEmail: string | null = null;

  constructor(
    private auth: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private router: Router
  ) {
    // Removed invalid method call as IonIcon does not support addIcons.
  }

  ngOnInit() {
    // Nos suscribimos al userEmail$ que ahora tu AuthService expone
    this.auth.userEmail$.subscribe((email) => {
      this.userEmail = email;
    });
  }

  /** Muestra el menú de usuario con “Cerrar sesión” */
  async openUserMenu() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.userEmail ?? 'Usuario',
      buttons: [
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          icon: 'log-out',
          cssClass: 'action-sheet-destructive',
          handler: () => {
            this.auth.logout();
            this.router.navigateByUrl('/login', { replaceUrl: true });
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
          cssClass: 'action-sheet-cancel',
        },
        {
          text: 'Adminitrar tus datos',
          icon: 'person-circle',
          handler: () => {
            this.router.navigateByUrl('/admin');
          },
          cssClass: 'action-sheet-admin',
        },
        {
          text: 'Volver a la página de inicio',
          icon: 'home',
          cssClass: 'action-sheet-home',
          handler: () => {
            this.router.navigateByUrl('/tabs/inicio', { replaceUrl: true });
          },
        },
      ],
    });
    await actionSheet.present();
  }
}
