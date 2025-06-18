import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CitaService } from 'src/app/services/citas.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-editar-cita-popover',
  templateUrl: './editar-cita-popover.component.html',
  styleUrls: ['./editar-cita-popover.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EditarCitaPopoverComponent implements OnInit {
  @Input() cita: any;

  estados = ['Confirmada', 'Programada', 'Completada', 'Cancelada'];

  veterinarios: any[] = [];
  mascotasCliente: any[] = [];

  private apiUrl = environment.apiUrl;

  constructor(
    private modalCtrl: ModalController,
    private citaService: CitaService,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.inicializarPropiedades();
    this.cargarVeterinarios();

    if (this.cita?.cliente?._id) {
      this.cargarMascotas(this.cita.cliente._id);
    } else {
      console.warn('No hay ID del cliente disponible para cargar mascotas.');
      this.presentToast('No se pudo cargar el cliente.');
    }
  }

  inicializarPropiedades() {
    this.cita.veterinario ??= {};
    this.cita.mascota ??= {};
    this.cita.cliente ??= {};
    this.cita.servicioPrestado ??= {};
  }

  cargarVeterinarios() {
    this.http
      .get<any[]>(`${this.apiUrl}/veterinario`)
      .subscribe({
        next: (data) => {
          this.veterinarios = data;
          console.log('Veterinarios cargados:', data);
        },
        error: (err) => {
          console.error('Error al cargar veterinarios:', err);
          this.presentToast('Error al cargar veterinarios');
        },
      });
  }

  cargarMascotas(clienteId: string) {
    this.http
      .get<
        any[]
      >(`${this.apiUrl}/clientes/${clienteId}/mascotas`)
      .subscribe({
        next: (data) => {
          this.mascotasCliente = data;
          console.log('Mascotas del cliente:', data);
        },
        error: (err) => {
          console.error('Error al cargar mascotas del cliente:', err);
          this.presentToast('Error al cargar mascotas');
        },
      });
  }

  guardar() {
    this.citaService.updateCita(this.cita._id, this.cita).subscribe({
      next: () => {
        this.modalCtrl.dismiss({ citaActualizada: this.cita });
        this.presentToast('Cita actualizada correctamente');
      },
      error: () => {
        this.presentToast('Error al guardar cambios');
        this.modalCtrl.dismiss();
      },
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'warning',
    });
    await toast.present();
  }
}
