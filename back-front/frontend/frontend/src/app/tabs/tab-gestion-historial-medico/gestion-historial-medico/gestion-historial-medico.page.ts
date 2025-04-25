import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonSearchbar,
  IonList, IonItem, IonLabel,
  IonSelect, IonSelectOption,
  IonButton, IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormularioEntradaHistorialComponent } from 'src/app/components/formulario-entrada-historial/formulario-entrada-historial.component';

@Component({
  selector: 'app-gestion-historial-medico',
  templateUrl: './gestion-historial-medico.page.html',
  styleUrls: ['./gestion-historial-medico.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    HeaderComponent,
    FormularioEntradaHistorialComponent
  ]
})
export class GestionHistorialMedicoPage implements OnInit {
  // === Gestión ===
  busquedaCliente = '';
  clientesFiltrados: any[] = [];
  clienteSeleccionado: any = null;
  mascotasDelCliente: any[] = [];
  mascotaSeleccionada: any = null;
  historialMedico: any = null;

  mesesDisponibles: number[] = [];
  mesSeleccionado: number | '' = '';
  entradasFiltradas: any[] = [];

  // === Detalle ===
  vista: 'gestion' | 'entrada' = 'gestion';
  entradaDetalle: any = null;

  private apiUrl = 'http://localhost:3000/veterinaria';

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Si llegamos con params, vamos directo al detalle
    this.route.queryParams.subscribe(params => {
      if (params['historialId'] && params['entradaId']) {
        this.vista = 'entrada';
        this.cargarEntradaDesdeParams(params['historialId'], params['entradaId']);
      }
    });
  }

  // --- Gestión ---
  buscarClientes() {
    const q = this.busquedaCliente.trim();
    if (!q) {
      this.clientesFiltrados = [];
      return;
    }
    this.http.get<any[]>(`${this.apiUrl}/clientes?search=${q}`)
      .subscribe(
        c => this.clientesFiltrados = c,
        () => this.presentToast('Error buscando clientes', 'danger')
      );
  }

  seleccionarCliente(c: any) {
    this.clienteSeleccionado = c;
    this.mascotaSeleccionada = null;
    this.historialMedico = null;
    this.mesesDisponibles = [];
    this.mesSeleccionado = '';
    this.entradasFiltradas = [];

    this.http.get<any[]>(`${this.apiUrl}/clientes/${c._id}/mascotas`)
      .subscribe(
        m => this.mascotasDelCliente = m,
        () => this.presentToast('Error cargando mascotas', 'danger')
      );
  }

  cargarHistorial() {
    if (!this.mascotaSeleccionada) return;

    this.http.get<any>(`${this.apiUrl}/mascotas/${this.mascotaSeleccionada._id}/historial-medico`)
      .subscribe(
        h => {
          this.historialMedico = h;
          this.entradasFiltradas = h.entradas || [];
          const meses = (h.entradas || []).map((e: any) =>
            new Date(e.fecha).getMonth() + 1
          );
          this.mesesDisponibles = Array.from(new Set<number>(meses)).sort((a, b) => a - b);
        },
        () => this.presentToast('Error cargando historial', 'danger')
      );
  }

  filtrarPorMes() {
    if (!this.historialMedico) return;
    if (this.mesSeleccionado) {
      this.entradasFiltradas = this.historialMedico.entradas.filter((e: any) =>
        new Date(e.fecha).getMonth() + 1 === this.mesSeleccionado
      );
    } else {
      this.entradasFiltradas = this.historialMedico.entradas;
    }
  }

  /** Abre el modal para agregar nueva entrada */
  async abrirFormularioEntrada() {
    // Forzamos que la llamada siempre devuelva un array
    const citas = (await this.http
      .get<any[]>(`${this.apiUrl}/mascotas/${this.mascotaSeleccionada._id}/citas`)
      .toPromise()) || [];

    if (!citas.length) {
      return this.presentToast('No hay citas para esta mascota', 'warning');
    }

    const ultima = citas[citas.length - 1];
    const modal = await this.modalCtrl.create({
      component: FormularioEntradaHistorialComponent,
      componentProps: {
        mascotaID: this.mascotaSeleccionada._id,
        citaID: ultima._id,
        veterinarioID: ultima.veterinario._id
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      // agregamos la nueva entrada y refiltramos
      this.historialMedico.entradas.push(data);
      this.filtrarPorMes();
    }
  }

  verificarCitas() {
    // ya no hace falta, usamos abrirFormularioEntrada directamente
    this.abrirFormularioEntrada();
  }

  abrirDetalleEntrada(e: any) {
    if (!this.historialMedico?._id) return;
    this.http.get<any>(`${this.apiUrl}/historial-medico/${this.historialMedico._id}`)
      .subscribe(
        hist => {
          const full = hist.entradas.find((x: any) => x._id === e._id);
          this.entradaDetalle = { ...full, mascota: hist.mascotaID };
          this.vista = 'entrada';
        },
        () => this.presentToast('Error cargando detalle', 'danger')
      );
  }

  private cargarEntradaDesdeParams(histId: string, entId: string) {
    this.http.get<any>(`${this.apiUrl}/historial-medico/${histId}`)
      .subscribe(
        hist => {
          const full = hist.entradas.find((x: any) => x._id === entId);
          this.entradaDetalle = { ...full, mascota: hist.mascotaID };
        },
        () => this.presentToast('Error cargando entrada', 'danger')
      );
  }

  private async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const t = await this.toastCtrl.create({ message, color, duration: 2000 });
    await t.present();
  }
}
