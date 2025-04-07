import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonLabel, IonSelect, IonSelectOption,
  IonInput, IonList, IonText, IonAlert
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { DetalleModalComponent } from 'src/app/components/detalle-modal/detalle-modal.component';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonSelect, IonSelectOption,
    IonInput, IonList, IonText, IonAlert,
    CommonModule, FormsModule, HttpClientModule,
    HeaderComponent, DetalleModalComponent
  ]
})
export class TabConsultas implements OnInit {

  colecciones = [
    { nombre: 'Clientes', valor: 'clientes' },
    { nombre: 'Mascotas', valor: 'mascotas' },
    { nombre: 'Historial Médico', valor: 'historial-medico' },
    { nombre: 'Facturación', valor: 'facturacion' },
    { nombre: 'Servicios', valor: 'servicio-prestado' },
    { nombre: 'Veterinarios', valor: 'veterinario' },
    { nombre: 'Citas', valor: 'cita' }
  ];

  coleccionSeleccionada: string = '';
  terminoBusqueda: string = '';
  resultados: any[] = [];
  sugerencias: any[] = [];
  mostrarSugerencias: boolean = false;

  private debounceTimer: any;
  apiUrl = 'http://localhost:3000/veterinaria';

  constructor(private http: HttpClient, private modalCtrl: ModalController) {}

  ngOnInit() {}

  onInputChange() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.buscarDatos();
    }, 300);
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.resultados = [];
    this.sugerencias = [];
    this.mostrarSugerencias = false;
  }

  buscarDatos() {
    if (!this.coleccionSeleccionada || !this.terminoBusqueda.trim()) {
      this.resultados = [];
      this.sugerencias = [];
      this.mostrarSugerencias = false;
      return;
    }

    const endpoint = `${this.apiUrl}/${this.coleccionSeleccionada}?search=${this.terminoBusqueda}`;

    this.http.get<any[]>(endpoint).subscribe({
      next: (res) => {
        this.sugerencias = res;
        this.resultados = res;
        this.mostrarSugerencias = true;
      },
      error: () => {
        this.sugerencias = [];
        this.resultados = [];
        this.mostrarSugerencias = false;
      }
    });
  }

  seleccionarSugerencia(item: any) {
    this.terminoBusqueda = item.nombre || item.titulo || item.descripcion || item._id;
    this.resultados = [item];
    this.mostrarSugerencias = false;
  }

  getSubtitulo(item: any): string {
    if (item.mascotas?.length >= 0) return `Mascotas registradas: ${item.mascotas.length}`;
    return item.email || item.especie || '';
  }

  async verDetalles(item: any) {
    const modal = await this.modalCtrl.create({
      component: DetalleModalComponent,
      componentProps: { datos: item },
      cssClass: 'custom-modal'
    });
    await modal.present();
  }
}
