import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonItem,
  IonLabel, IonSelect, IonSelectOption,
  IonInput, IonList, IonText,
  IonCheckbox, IonButton
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { DetalleModalComponent } from 'src/app/components/detalle-modal/detalle-modal.component';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    DetalleModalComponent
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
    { nombre: 'Citas', valor: 'citas' }
  ];

  coleccionSeleccionada = '';
  terminoBusqueda = '';
  resultados: any[] = [];
  todosElementos: any[] = [];
  clientesSeleccionados = new Set<string>();

  private apiUrl = 'http://localhost:3000/veterinaria';

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // arrancamos sin colección, espera a que el usuario seleccione
  }

  onColeccionChange() {
    this.terminoBusqueda = '';
    this.resultados = [];
    this.clientesSeleccionados.clear();
    if (!this.coleccionSeleccionada) return;
    this.http.get<any[]>(`${this.apiUrl}/${this.coleccionSeleccionada}`)
      .subscribe({
        next: list => {
          this.todosElementos = list;
          this.resultados = [...list];
        },
        error: async () => {
          const t = await this.toastCtrl.create({ message: 'Error cargando datos', color: 'danger', duration: 2000 });
          await t.present();
        }
      });
  }

  buscarDatos() {
    const q = this.terminoBusqueda.trim().toLowerCase();
    if (!q) {
      this.resultados = [...this.todosElementos];
      return;
    }
    this.resultados = this.todosElementos.filter(item => {
      switch (this.coleccionSeleccionada) {
        case 'historial-medico':
          const nombre = item.mascotaID?.nombre?.toLowerCase() || '';
          const ultFecha = item.entradas?.length
            ? new Date(item.entradas[item.entradas.length-1].fecha)
              .toLocaleDateString().toLowerCase()
            : '';
          return nombre.includes(q) || ultFecha.includes(q);

        case 'citas':
          const cli = item.cliente?.nombre?.toLowerCase() || '';
          const mas = item.mascota?.nombre?.toLowerCase() || '';
          return cli.includes(q) || mas.includes(q) || item.motivo?.toLowerCase().includes(q);

        default:
          return item.nombre?.toLowerCase().includes(q)
              || item.email?.toLowerCase().includes(q)
              || item.especie?.toLowerCase().includes(q);
      }
    });
  }

  async verDetalles(item: any) {
    try {
      const raw = await this.http.get<any>(`${this.apiUrl}/${this.coleccionSeleccionada}/${item._id}`).toPromise();
      const modal = await this.modalCtrl.create({
        component: DetalleModalComponent,
        componentProps: {
          datos: raw,
          coleccion: this.coleccionSeleccionada
        },
        cssClass: 'custom-modal'
      });
      await modal.present();
    } catch {
      const t = await this.toastCtrl.create({ message: 'Error obteniendo detalles', color: 'danger', duration: 2000 });
      await t.present();
    }
  }

  obtenerNombreVisible(item: any): string {
    if (this.coleccionSeleccionada === 'citas') {
      const cli = item.cliente?.nombre
        ? `${item.cliente.nombre} ${item.cliente.apellido}`
        : '–';
      const mas = item.mascota?.nombre || '–';
      return `${cli} — ${mas}`;
    }
    if (this.coleccionSeleccionada === 'historial-medico') {
      return item.mascotaID?.nombre || 'Historial';
    }
    return item.nombre || item._id;
  }

  getSubtitulo(item: any): string {
    if (this.coleccionSeleccionada === 'citas') {
      return new Date(item.fechaHora).toLocaleString();
    }
    if (this.coleccionSeleccionada === 'historial-medico') {
      const ent = item.entradas?.length
        ? item.entradas[item.entradas.length-1].fecha
        : null;
      return ent
        ? `Última entrada: ${new Date(ent).toLocaleDateString()}`
        : 'Sin entradas';
    }
    return item.email || item.especie || '—';
  }

  toggleClienteSeleccionado(id: string) {
    this.clientesSeleccionados.has(id)
      ? this.clientesSeleccionados.delete(id)
      : this.clientesSeleccionados.add(id);
  }

  toggleSeleccionTodos(ev: any) {
    if (ev.detail.checked) {
      this.todosElementos.forEach(i => this.clientesSeleccionados.add(i._id));
    } else {
      this.clientesSeleccionados.clear();
    }
  }

  borrarElementosSeleccionados() {
    if (!this.clientesSeleccionados.size) return;
    const ids = Array.from(this.clientesSeleccionados);
    this.http.delete(`${this.apiUrl}/${this.coleccionSeleccionada}`, { body: ids })
      .subscribe(async () => {
        this.resultados = this.resultados.filter(i => !this.clientesSeleccionados.has(i._id));
        this.clientesSeleccionados.clear();
        const t = await this.toastCtrl.create({ message: 'Eliminados', color: 'success', duration: 2000 });
        await t.present();
      }, async () => {
        const t = await this.toastCtrl.create({ message: 'Error al eliminar', color: 'danger', duration: 2000 });
        await t.present();
      });
  }
}
