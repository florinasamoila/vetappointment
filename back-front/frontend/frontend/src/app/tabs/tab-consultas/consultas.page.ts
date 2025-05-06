// src/app/consultas/consultas.page.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonList,
  IonText,
  IonCheckbox,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
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
    DetalleModalComponent,

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
  todosElementos: any[] = [];
  resultados: any[] = [];
  clientesSeleccionados = new Set<string>();
  loading = false;

  // Paginación para infinite scroll
  private pageSize = 6;
  private offset = 0;

  private apiUrl = 'http://localhost:3000/veterinaria';

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // nothing on init
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'warning'
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'middle',
      color
    });
    await t.present();
  }

  onColeccionChange() {
    this.terminoBusqueda = '';
    this.resultados = [];
    this.clientesSeleccionados.clear();
    this.loading = true;
    if (!this.coleccionSeleccionada) {
      this.loading = false;
      return;
    }
    this.http.get<any[]>(`${this.apiUrl}/${this.coleccionSeleccionada}`)
      .subscribe({
        next: list => {
          this.todosElementos = list;
          if (list.length === 0) {
            this.presentToast('No se encontraron datos en la colección seleccionada.', 'warning');
          }
          this.resetPagination();
          this.loading = false;
        },
        error: async () => {
          this.loading = false;
          const t = await this.toastCtrl.create({ message: 'Error cargando datos', color: 'danger', duration: 2000 });
          await t.present();
        }
      });
  }

  buscarDatos() {
    const q = this.terminoBusqueda.trim().toLowerCase();
    if (!q) {
      this.resetPagination();
      return;
    }
    const filtered = this.todosElementos.filter(item => {
      switch (this.coleccionSeleccionada) {
        case 'historial-medico':
          const nombre = item.mascotaID?.nombre?.toLowerCase() || '';
          const ultFecha = item.entradas?.length
            ? new Date(item.entradas[item.entradas.length - 1].fecha)
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
    if (filtered.length === 0) {
      this.presentToast(`No se encontraron resultados para "${this.terminoBusqueda}".`, 'warning');
    }
    this.todosElementos = filtered;
    this.resetPagination();
  }

  async verDetalles(item: any) {
    try {
      const raw = await this.http
        .get<any>(`${this.apiUrl}/${this.coleccionSeleccionada}/${item._id}`)
        .toPromise();
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
      const t = await this.toastCtrl.create({
        message: 'Error obteniendo detalles',
        color: 'danger',
        duration: 2000
      });
      await t.present();
    }
  }

  obtenerNombreVisible(item: any): string {
    if (this.coleccionSeleccionada === 'citas') {
      const cli = item.cliente?.nombre
        ? `${item.cliente.nombre} ${item.cliente.apellido}` : '–';
      const mas = item.mascota?.nombre || '–';
      return `${cli} — ${mas}`;
    }
    if (this.coleccionSeleccionada === 'historial-medico') {
      const nombreMascota = item.mascotaID?.nombre || '—';
      return `Historial de ${nombreMascota}:`;
    }
    return item.nombre || item._id;
  }

  getSubtitulo(item: any): string {
    if (this.coleccionSeleccionada === 'citas') {
      return new Date(item.fechaHora).toLocaleString();
    }
    if (this.coleccionSeleccionada === 'historial-medico') {
      const ent = item.entradas?.length
        ? item.entradas[item.entradas.length - 1].fecha
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
        this.todosElementos = this.todosElementos.filter(i => !this.clientesSeleccionados.has(i._id));
        this.clientesSeleccionados.clear();
        this.resetPagination();
        const t = await this.toastCtrl.create({
          message: 'Eliminados',
          color: 'success',
          duration: 2000
        });
        await t.present();
      }, async () => {
        const t = await this.toastCtrl.create({
          message: 'Error al eliminar',
          color: 'danger',
          duration: 2000
        });
        await t.present();
      });
  }

  /** Infinite scroll handler */
  loadMore(event: any) {
    const nextChunk = this.todosElementos.slice(this.offset, this.offset + this.pageSize);
    this.resultados.push(...nextChunk);
    this.offset += nextChunk.length;
    event.target.complete();
    // deshabilita cuando ya cargamos todo
    if (this.offset >= this.todosElementos.length) {
      event.target.disabled = true;
    }
  }

  /** Reset resultados to first page */
  private resetPagination() {
    this.offset = this.pageSize;
    this.resultados = this.todosElementos.slice(0, this.pageSize);
  }
}
