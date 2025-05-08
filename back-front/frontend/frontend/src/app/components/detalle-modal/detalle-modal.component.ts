import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from '@angular/core';
import {
  IonicModule,
  ModalController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin, of, firstValueFrom } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-modal',
  templateUrl: './detalle-modal.component.html',
  styleUrls: ['./detalle-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, NgIf, NgFor, CommonModule],
})
export class DetalleModalComponent implements OnInit {
  @Input() datos: any;
  @Input() coleccion!: string;

  private base = 'http://localhost:3000/veterinaria';

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.coleccion === 'citas') {
      this.popularCita();
    } else if (this.coleccion === 'historial-medico') {
      this.popularHistorial();
    }
    if (this.coleccion === 'clientes') {
      this.popularClientesMascotas();
    }
  }

  private popularClientesMascotas() {
    // Vaciamos antes, para no acumular viejos resultados
    this.datos.mascotas = [];

    // Llamamos al endpoint /clientes/:id/mascotas
    this.http
      .get<any[]>(`${this.base}/clientes/${this.datos._id}/mascotas`)
      .subscribe({
        next: (mascotas) => (this.datos.mascotas = mascotas),
        error: () => (this.datos.mascotas = []),
      });
  }

  private popularCita() {
    forkJoin({
      cliente: this.http
        .get(`${this.base}/clientes/${this.datos.cliente}`)
        .pipe(catchError(() => of(null))),
      mascota: this.http
        .get(`${this.base}/mascotas/${this.datos.mascota}`)
        .pipe(catchError(() => of(null))),
      veterinario: this.http
        .get(`${this.base}/veterinario/${this.datos.veterinario}`)
        .pipe(catchError(() => of(null))),
      servicioPrestado: this.http
        .get(`${this.base}/servicio-prestado/${this.datos.servicioPrestado}`)
        .pipe(catchError(() => of(null))),
    }).subscribe((pop) => (this.datos = { ...this.datos, ...pop }));
  }

  private popularHistorial() {
    this.http
      .get<any>(`${this.base}/historial-medico/${this.datos._id}`)
      .pipe(
        switchMap((hist) => {
          // extraemos la cadena del ID
          const mascotaId =
            typeof hist.mascotaID === 'string'
              ? hist.mascotaID
              : hist.mascotaID._id;
          // ahora sí pedimos la mascota por su _id
          return this.http
            .get(`${this.base}/mascotas/${mascotaId}`)
            .pipe(map((mascota) => ({ ...hist, mascotaID: mascota })));
        })
      )
      .subscribe((full) => (this.datos = full));
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  verEntrada(e: any) {
    const historialId = this.datos._id;
    const entradaId = e._id;
    this.modalCtrl.dismiss().then(() => {
      this.router.navigate(['/tabs/gestion-historial-medico'], {
        queryParams: { historialId, entradaId },
      });
    });
  }

  async confirmDeleteEntry(entry: any): Promise<boolean> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar entrada',
      message: '¿Estás seguro? Esta acción es irreversible.',
      inputs: [
        { name: 'password', type: 'password', placeholder: 'Contraseña' },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            return false;
          },
        },
        {
          text: 'Eliminar',
          handler: async (data) => {
            const pwd = data.password;
            const email = localStorage.getItem('vetapp_user');
            if (!email) {
              this.presentToast('Usuario no autenticado', 'danger');
              return false;
            }
            const ok = await firstValueFrom(this.authService.login(email, pwd));
            if (!ok) {
              this.presentToast('Contraseña incorrecta', 'danger');
              return false;
            }
            try {
              await firstValueFrom(
                this.http.delete(
                  `${this.base}/historial-medico/${this.datos._id}/entrada/${entry._id}`
                )
              );
              this.presentToast('Entrada eliminada', 'success');
              this.popularHistorial();
            } catch {
              this.presentToast('Error al eliminar', 'danger');
            }
            return true;
          },
        },
      ],
    });
    await alert.present();
    return true;
  }

  editarRegistro() {
    const params: any = {};
    if (this.coleccion === 'clientes') {
      params.clienteId = this.datos._id;
    } else if (this.coleccion === 'mascotas') {
      params.mascotaId = this.datos._id;
    }
    this.modalCtrl.dismiss().then(() => {
      this.router.navigate(['/tabs/registro-cliente'], { queryParams: params });
    });
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'warning'
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await t.present();
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj).filter(
      (k) =>
        (typeof obj[k] !== 'object' || obj[k] === null) &&
        ![
          'mascotaID',
          'entradas',
          'cliente',
          'mascota',
          'veterinario',
          'servicioPrestado',
        ].includes(k)
    );
  }

  formatKey(key: string): string {
    const limpiar = key.replace(/^_/, '').replace(/([A-Z])/g, ' $1');
    return limpiar.charAt(0).toUpperCase() + limpiar.slice(1);
  }

  getIconoPorCampo(campo: string): string {
    const mapa: any = {
      nombre: 'person',
      apellido: 'person-outline',
      email: 'mail',
      telefono: 'call',
      direccion: 'location',
      fechaNacimiento: 'calendar',
      especie: 'paw',
      raza: 'paw-outline',
      peso: 'fitness',
      motivo: 'information-circle',
      estado: 'checkmark-circle',
      observaciones: 'document-text',
    };
    return mapa[campo] || 'information-circle-outline';
  }
}
