// src/app/tabs/tab-inicio/inicio.page.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CitaService } from 'src/app/services/citas.service';
import { EditarCitaPopoverComponent } from 'src/app/components/editar-cita-popover/editar-cita-popover.component';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent
  ]
})
export class TabInicio implements OnInit {
  allCitas: any[] = [];
  citas: any[] = [];
  estados = ['Todos', 'Confirmada', 'Programada', 'Completada', 'Cancelada'];
  selectedEstado = 'Todos';

  // Horario de 8:00 a 18:00
  horas = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`);

  // Fecha seleccionada (para ion-datetime)
  selectedDate: Date = new Date();
  selectedDateStr = this.selectedDate.toISOString();

  // Lista única de veterinarios
  veterinarios: any[] = [];

  constructor(
    private citaService: CitaService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.citaService.getAllCitas().subscribe({
      next: data => {
        this.allCitas = data;
        // Extraer veterinarios únicos
        this.veterinarios = Array.from(new Map(
          data.map(c => [c.veterinario._id, c.veterinario])
        ).values());
        this.cargarCitasPorFecha();
      },
      error: err => {
        console.error('Error cargando citas', err);
        this.presentToast('Error cargando citas', 'danger');
      }
    });
  }

  /** Filtra todas las citas para la fecha seleccionada, luego muestra toast si no hay */
  cargarCitasPorFecha() {
    const sel = new Date(this.selectedDateStr);
    this.citas = this.allCitas.filter(c => {
      const cDate = new Date(c.fechaHora);
      return cDate.toDateString() === sel.toDateString();
    });

    if (this.citas.length === 0) {
      this.presentToast('No hay citas programadas para esta fecha', 'warning');
    }

    // Al cambiar de fecha, resetear filtro de estado
    this.selectedEstado = 'Todos';
  }

  /** Filtra las citas ya cargadas según el estado seleccionado */
  filtrarCitasPorEstado(estado: string) {
    this.selectedEstado = estado;
    if (estado === 'Todos') {
      // recargar todas las de la fecha actual
      this.cargarCitasPorFecha();
    } else {
      this.citas = this.citas.filter(c => c.estado === estado);
    }
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'Confirmada': return 'confirmada';
      case 'Completada': return 'completada';
      case 'Cancelada':  return 'cancelada';
      default:           return 'programada';
    }
  }

  /** Abre modal para editar solo cita, hora, vet. y servicio */
  async abrirModalEditarCita(cita: any) {
    const modal = await this.modalController.create({
      component: EditarCitaPopoverComponent,
      componentProps: { cita: { ...cita } }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    const updated = data?.citaActualizada;
    if (updated) {
      const idx = this.allCitas.findIndex(c => c._id === updated._id);
      if (idx > -1) this.allCitas[idx] = updated;
      this.cargarCitasPorFecha();
      this.presentToast('Cita actualizada correctamente', 'success');
    }
  }

  /** Confirma con toast antes de marcar estado */
  async confirmarCambioEstado(cita: any, nuevoEstado: string) {
    const toast = await this.toastController.create({
      message: `¿Marcar como ${nuevoEstado.toLowerCase()}?`,
      position: 'top',
      buttons: [
        {
          side: 'end',
          text: 'Sí',
          handler: () => {
            cita.estado = nuevoEstado;
            const idx = this.allCitas.findIndex(c => c._id === cita._id);
            if (idx > -1) this.allCitas[idx].estado = nuevoEstado;
            this.cargarCitasPorFecha();
            this.presentToast(`Estado cambiado a ${nuevoEstado}`, 'success');
          }
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await toast.present();
  }

  /** Muestra un toast */
  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'success'
  ) {
    const t = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });
    await t.present();
  }
}
