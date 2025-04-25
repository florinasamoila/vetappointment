import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-modal',
  templateUrl: './detalle-modal.component.html',
  styleUrls: ['./detalle-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, NgIf, NgFor, CommonModule]
})
export class DetalleModalComponent implements OnInit {
  @Input() datos: any;
  @Input() coleccion!: string;

  private base = 'http://localhost:3000/veterinaria';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.coleccion === 'citas') {
      this.popularCita();
    } else if (this.coleccion === 'historial-medico') {
      this.popularHistorial();
    }
  }

  /** Trae y popula referencias de Cita */
  private popularCita() {
    forkJoin({
      cliente: this.http.get(`${this.base}/clientes/${this.datos.cliente}`).pipe(catchError(() => of(null))),
      mascota: this.http.get(`${this.base}/mascotas/${this.datos.mascota}`).pipe(catchError(() => of(null))),
      veterinario: this.http.get(`${this.base}/veterinario/${this.datos.veterinario}`).pipe(catchError(() => of(null))),
      servicioPrestado: this.http.get(`${this.base}/servicio-prestado/${this.datos.servicioPrestado}`).pipe(catchError(() => of(null)))
    }).subscribe(pop => {
      this.datos = { ...this.datos, ...pop };
    });
  }

  /** Trae y popula referencias de Historial Médico */
  private popularHistorial() {
    this.http.get<any>(`${this.base}/historial-medico/${this.datos._id}`)
      .pipe(
        switchMap(hist =>
          this.http.get(`${this.base}/mascotas/${hist.mascotaID}`)
            .pipe(
              switchMap(masc => {
                hist.mascotaID = masc;
                const entradas$ = hist.entradas.map((e: any) =>
                  forkJoin({
                    cita: this.http.get(`${this.base}/citas/${e.cita}`).pipe(catchError(() => of(null))),
                    veterinario: this.http.get(`${this.base}/veterinario/${e.veterinario}`).pipe(catchError(() => of(null)))
                  }).pipe(map(pop => ({ ...e, ...pop })))
                );
                return entradas$.length
                  ? forkJoin(entradas$).pipe(map(popEnt => ({ ...hist, entradas: popEnt })))
                  : of({ ...hist, entradas: [] });
              })
            )
        )
      )
      .subscribe(full => this.datos = full);
  }

  /** Cierra el modal */
  cerrar() {
    this.modalCtrl.dismiss();
  }

  /** Navega al detalle de la entrada en la página de Historial Médico */
  verEntrada(e: any) {
    const historialId = this.datos._id;
    const entradaId = e._id;
    this.modalCtrl.dismiss().then(() => {
      this.router.navigate(['/tabs/gestion-historial-medico'], {
        queryParams: { historialId, entradaId }
      });
    });
  }

  /** Navega al formulario de edición de Cliente o Mascota */
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

  /** Helpers para iterar campos */
  getKeys(obj: any): string[] {
    return Object.keys(obj).filter(k =>
      (typeof obj[k] !== 'object' || obj[k] === null) &&
      !['mascotaID','entradas','cliente','mascota','veterinario','servicioPrestado'].includes(k)
    );
  }

  /** Convierte `fechaNacimiento` ➞ `Fecha Nacimiento`, etc. */
  formatKey(key: string): string {
    const limpiar = key.replace(/^_/, '').replace(/([A-Z])/g, ' $1');
    return limpiar.charAt(0).toUpperCase() + limpiar.slice(1);
  }

  /** Icono según campo */
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
      observaciones: 'document-text'
    };
    return mapa[campo] || 'information-circle-outline';
  }
}
