import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard,
  IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonDatetime,
  IonGrid, IonInput, IonItem, IonLabel, IonList, IonRow, IonSearchbar,
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';

import { ClienteService } from '../../services/clientes.service';
import { Cliente } from '../../common/cliente';
import { CitaService } from '../../services/citas.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'gestion-citas.page.html',
  styleUrls: ['gestion-citas.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard,
    IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonDatetime,
    IonGrid, IonInput, IonItem, IonLabel, IonList, IonRow, IonSearchbar,
    IonSelect, IonSelectOption, CommonModule, FullCalendarModule,
    FormsModule, HeaderComponent
  ],
})
export class TabGestionCitas implements OnInit {

  busquedaCliente: string = '';
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
    veterinario: ''
  };

  horariosDisponibles: string[] = [];

  servicios: any[] = [];
  veterinarios: any[] = [];

  apiUrl = 'http://localhost:3000/veterinaria';

  constructor(
    private clienteService: ClienteService,
    private citaService: CitaService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.generarHorarios();

    this.http.get(`${this.apiUrl}/servicio-prestado`).subscribe((data: any) => {
      this.servicios = data;
    });

    this.http.get(`${this.apiUrl}/veterinario`).subscribe((data: any) => {
      this.veterinarios = data;
    });
  }

  generarHorarios() {
    const bloques: string[] = [];
    let hora = 9;
    let minuto = 0;

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
    if (texto.length === 0) {
      this.clientesFiltrados = [];
      return;
    }

    this.clienteService.buscarClientes(texto).subscribe(clientes => {
      this.clientesFiltrados = clientes;
    });
  }

  seleccionarCliente(cliente: Cliente) {
    this.cita.nombreCliente = cliente.nombre;
    this.cita.clienteId = cliente._id;
    this.busquedaCliente = cliente.nombre;
    this.clientesFiltrados = [];
    this.cita.mascota = '';
    this.mascotasCliente = [];

    this.clienteService.obtenerMascotasPorCliente(cliente._id).subscribe(
      mascotas => {
        this.mascotasCliente = mascotas;
      },
      error => {
        console.error('❌ Error al obtener mascotas:', error);
      }
    );
  }

  mostrarResumenCita() {
    const { nombreCliente, mascota, servicio, fecha, hora, veterinario } = this.cita;
    if (nombreCliente && mascota && servicio && fecha && hora && veterinario) {
      this.mostrarResumen = true;
    }
  }

  cancelarResumen() {
    this.mostrarResumen = false;
  }

  confirmarCitaFinal() {
    const horaInicio = this.cita.hora?.split(' - ')[0];
  
    // Aseguramos formato de fecha yyyy-mm-dd
    const fechaISO = new Date(this.cita.fecha);
    const fechaFormateada = fechaISO.toISOString().split('T')[0]; // "2025-04-02"
  
    const fechaHora = new Date(`${fechaFormateada}T${horaInicio}:00`);
  
    const citaParaGuardar = {
      cliente: this.cita.clienteId,
      mascota: this.cita.mascota,
      servicioPrestado: this.cita.servicio,
      veterinario: this.cita.veterinario,
      fechaHora: fechaHora,
      estado: 'Programada',
      motivo: 'Consulta general'
    };
  
    this.citaService.crearCita(citaParaGuardar).subscribe({
      next: (res) => {
        console.log('✅ Cita creada', res);
        this.mostrarResumen = false;
      },
      error: (err) => {
        console.error('❌ Error al guardar la cita:', err);
      }
    });
  }
  

  getNombreMascota(id: string): string {
    const m = this.mascotasCliente.find(m => m._id === id);
    return m ? m.nombre : id;
  }

  getNombreServicio(id: string): string {
    const s = this.servicios.find(s => s._id === id);
    return s ? s.nombre : id;
  }

  getNombreVeterinario(id: string): string {
    const v = this.veterinarios.find(v => v._id === id);
    return v ? v.nombre : id;
  }
}
