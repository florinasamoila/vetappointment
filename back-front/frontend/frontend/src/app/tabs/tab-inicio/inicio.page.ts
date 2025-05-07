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
  loading = true;  
  allCitas: any[] = [];
  citas: any[] = [];
  estados = ['Todos', 'Confirmada', 'Programada', 'Completada', 'Cancelada'];
  selectedEstado = 'Todos';

  // Horario de 8:00 a 18:00
  horas = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`);
  selectedHour: string | null = null;

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
    this.loading = true;
    this.citaService.getAllCitas().subscribe({
      next: data => {
        this.allCitas = data;
        if (data.length === 0) {
          this.presentToast('No se encontraron citas', 'warning');
        }
        // Filtrar citas que tienen veterinario definido antes de mapear
        const citasConVet = data.filter(c => c.veterinario != null);
        this.veterinarios = Array.from(new Map(
          citasConVet.map(c => [c.veterinario!._id, c.veterinario!])
        ).values());

        this.cargarCitasPorFecha();
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando citas', err);
        this.presentToast('Error cargando citas', 'danger');
        this.loading = false;
      }
    });
  }

  /** Aplica filtros de fecha, estado y hora, y ordena ascendente por hora */
  applyFilters(showNoResultsToast = false) {
    const selDate = new Date(this.selectedDateStr);
    let filtered = this.allCitas.filter(c => {
      const cDate = new Date(c.fechaHora);
      return cDate.toDateString() === selDate.toDateString();
    });

    if (this.selectedEstado !== 'Todos') {
      filtered = filtered.filter(c => c.estado === this.selectedEstado);
    }

    if (this.selectedHour) {
      const targetHour = parseInt(this.selectedHour, 10);
      filtered = filtered.filter(c => {
        const cHour = new Date(c.fechaHora).getHours();
        return cHour === targetHour;
      });
    }

    // Ordenar ascendente por fechaHora
    filtered.sort((a, b) =>
      new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    );

    this.citas = filtered;

    if (showNoResultsToast && filtered.length === 0) {
      this.presentToast('No hay citas que cumplan esos filtros', 'warning');
    }
  }

  /** Filtra todas las citas para la fecha seleccionada */
  cargarCitasPorFecha() {
    // Al cambiar de fecha, resetear filtros
    this.selectedEstado = 'Todos';
    this.selectedHour = null;
    this.applyFilters(true);
  }

  /** Filtra las citas según el estado seleccionado */
  filtrarCitasPorEstado(estado: string) {
    this.selectedEstado = estado;
    this.applyFilters();
  }

  /** Limpia el filtro de hora */
  clearHourFilter() {
    this.selectedHour = null;
    this.applyFilters();
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
      this.applyFilters();
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
            this.applyFilters();
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
      position: 'middle',
      color
    });
    await t.present();
  }
}