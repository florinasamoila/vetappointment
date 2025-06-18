import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';

import { ClienteService } from '../../services/clientes.service';
import { Cliente } from '../../common/cliente';
import { CitaService } from '../../services/citas.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
// Removed duplicate import of IonSearchbar

@Component({
  selector: 'app-tab2',
  templateUrl: 'gestion-citas.page.html',
  styleUrls: ['gestion-citas.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FullCalendarModule,
    HeaderComponent,
    HttpClientModule,
  ],
})
export class TabGestionCitas implements OnInit {
  busquedaCliente = '';
  clientesFiltrados: Cliente[] = [];
  mascotasCliente: any[] = [];
  mostrarResumen = false;
  cita = {
    nombreCliente: '',
    clienteId: '',
    mascota: '',
    servicio: '',
    fecha: '',
    hora: '',
    veterinario: '',
    observaciones: '',
  };
  horariosDisponibles: string[] = [];
  servicios: any[] = [];
  veterinarios: any[] = [];
  private apiUrl = environment.apiUrl;

  constructor(
    private clienteService: ClienteService,
    private citaService: CitaService,
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Al iniciar, generar horarios genéricos
    this.generarHorarios();

    this.http.get<any[]>(`${this.apiUrl}/servicio-prestado`).subscribe({
      next: (data) => (this.servicios = data),
      error: () => this.presentToast('Error cargando servicios', 'danger'),
    });

    this.http.get<any[]>(`${this.apiUrl}/veterinario`).subscribe({
      next: (data) => (this.veterinarios = data),
      error: () => this.presentToast('Error cargando veterinarios', 'danger'),
    });
  }

  generarHorarios() {
    const bloques: string[] = [];
    let hora = 9,
      minuto = 0;
    while (hora < 19) {
      const inicio = this.formatearHora(hora, minuto);
      minuto += 30;
      if (minuto >= 60) {
        minuto = 0;
        hora++;
      }
      const fin = this.formatearHora(hora, minuto);
      bloques.push(`${inicio} - ${fin}`);
      minuto += 15;
      if (minuto >= 60) {
        minuto = 0;
        hora++;
      }
    }
    this.horariosDisponibles = bloques;
  }

  formatearHora(h: number, m: number): string {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  filtrarClientes() {
    const texto = this.busquedaCliente.trim();
    if (!texto) {
      this.clientesFiltrados = [];
      return;
    }
    this.clienteService.buscarClientes(texto).subscribe({
      next: (clientes) => (this.clientesFiltrados = clientes),
      error: () => this.presentToast('Error buscando clientes', 'danger'),
    });
  }

  seleccionarCliente(cliente: Cliente) {
    this.cita.nombreCliente = cliente.nombre;
    this.cita.clienteId = cliente._id;
    this.busquedaCliente = cliente.nombre;
    this.clientesFiltrados = [];
    this.cita.mascota = '';
    this.mascotasCliente = [];

    this.clienteService.obtenerMascotasPorCliente(cliente._id).subscribe({
      next: (mascotas) => (this.mascotasCliente = mascotas),
      error: () => this.presentToast('Error al obtener mascotas', 'danger'),
    });
  }

  /**
   * Actualiza los horarios disponibles según el veterinario y la fecha seleccionados.
   */
  actualizarHorariosDisponibles() {
    if (this.cita.veterinario && this.cita.fecha) {
      // Generamos todos los bloques posibles
      this.generarHorarios();
      // Formateamos la fecha a YYYY-MM-DD
      const fechaISO = new Date(this.cita.fecha);
      const fechaFormateada = fechaISO.toISOString().split('T')[0];
      // Obtenemos citas existentes para ese vet en esa fecha
      this.http
        .get<
          any[]
        >(`${this.apiUrl}/cita?` + `veterinario=${this.cita.veterinario}&fecha=${fechaFormateada}`)
        .subscribe({
          next: (citas) => {
            // Creamos un array de horas ocupadas (HH:mm)
            const ocupados = citas.map((c) => {
              const dt = new Date(c.fechaHora);
              const hh = dt.getHours().toString().padStart(2, '0');
              const mm = dt.getMinutes().toString().padStart(2, '0');
              return `${hh}:${mm}`;
            });
            // Filtramos los bloques para eliminar los que comienzan en hora ocupada
            this.horariosDisponibles = this.horariosDisponibles.filter(
              (bloque) => {
                const inicio = bloque.split(' - ')[0];
                return !ocupados.includes(inicio);
              }
            );
          },
          error: () =>
            this.presentToast('Error cargando citas del veterinario', 'danger'),
        });
    } else {
      // Si falta vet o fecha, mostramos todos
      this.generarHorarios();
    }
  }

  mostrarResumenCita() {
    const { nombreCliente, mascota, servicio, fecha, hora, veterinario } =
      this.cita;
    if (nombreCliente && mascota && servicio && fecha && hora && veterinario) {
      this.mostrarResumen = true;
    } else {
      this.presentToast(
        'Completa todos los campos antes de continuar',
        'warning'
      );
    }
  }

  cancelarResumen() {
    this.mostrarResumen = false;
  }

  confirmarCitaFinal() {
    const horaInicio = this.cita.hora.split(' - ')[0];
    const fechaISO = new Date(this.cita.fecha);
    const fechaFormateada = fechaISO.toISOString().split('T')[0];
    const fechaHora = new Date(`${fechaFormateada}T${horaInicio}:00`);

    const citaParaGuardar = {
      cliente: this.cita.clienteId,
      mascota: this.cita.mascota,
      servicioPrestado: this.cita.servicio,
      veterinario: this.cita.veterinario,
      fechaHora,
      estado: 'Programada',
      motivo: 'Consulta general',
      observaciones: this.cita.observaciones,
    };

    this.citaService.crearCita(citaParaGuardar).subscribe({
      next: () => {
        this.presentToast('Cita creada con éxito', 'success');
        this.mostrarResumen = false;
        this.resetearFormulario();
      },
      error: () => this.presentToast('Error al guardar la cita', 'danger'),
    });
  }

  resetearFormulario() {
    this.cita = {
      nombreCliente: '',
      clienteId: '',
      mascota: '',
      servicio: '',
      fecha: '',
      hora: '',
      veterinario: '',
      observaciones: '',
    };
    this.mascotasCliente = [];
    this.busquedaCliente = '';
    this.clientesFiltrados = [];
    // Restauramos todos los horarios
    this.generarHorarios();
  }

  getNombreMascota(id: string): string {
    const m = this.mascotasCliente.find((x) => x._id === id);
    return m ? m.nombre : id;
  }
  getNombreServicio(id: string): string {
    const s = this.servicios.find((x) => x._id === id);
    return s ? s.nombre : id;
  }
  getNombreVeterinario(id: string): string {
    const v = this.veterinarios.find((x) => x._id === id);
    return v ? v.nombre : id;
  }

  /** Muestra un Toast de aviso o error */
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'middle',
    });
    await toast.present();
  }
}
