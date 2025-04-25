import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ModalController,
  PopoverController,
  IonicModule,
  ToastController
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { ResumenClienteModalComponent } from 'src/app/components/resumen-cliente-modal/resumen-cliente-modal.component';
import { PopoverMascotaPage } from 'src/app/pages/popover-mascota/popover-mascota.page';

@Component({
  selector: 'app-tab3',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'registro-cliente.page.html',
  styleUrls: ['registro-cliente.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    ResumenClienteModalComponent,
    PopoverMascotaPage
  ]
})
export class TabRegistroCliente implements OnInit {
  modoCliente: 'nuevo' | 'existente' | 'editar' | 'editar-mascota' = 'nuevo';
  clientesFiltrados: any[] = [];
  clienteSeleccionado: any = null;
  clienteForm: FormGroup;
  apiUrl = 'http://localhost:3000/veterinaria';
  clienteIdParam?: string;
  mascotaIdParam?: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,    // ← inyectamos ActivatedRoute
    private navCtrl: NavController
  ) {
    this.clienteForm = this.fb.group({
      clienteBusqueda: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      mascotaNombre: ['', Validators.required],
      mascotaEspecie: ['', Validators.required],
      mascotaRaza: ['', Validators.required],
      mascotaFechaNacimiento: ['', Validators.required],
      mascotaPeso: ['', Validators.required],
      mascotaCaracteristicas: ['', Validators.required],
      mascotas: this.fb.array([])
    });
  }

  ngOnInit() {
    // Leemos queryParams para entrar directamente en modo 'editar' o 'editar-mascota'
    this.route.queryParams.subscribe(params => {
      if (params['clienteId']) {
        this.clienteIdParam = params['clienteId'];
        this.modoCliente = 'editar';
        this.cargarCliente(params['clienteId']);
      }
      if (params['mascotaId']) {
        this.mascotaIdParam = params['mascotaId'];
        this.modoCliente = 'editar-mascota';
        this.cargarMascota(params['mascotaId']);
      }
    });
  }

  // ─── Helpers de carga para edición ────────────────────

  private cargarCliente(id: string) {
    this.http.get<any>(`${this.apiUrl}/clientes/${id}`)
      .subscribe(c => {
        this.clienteSeleccionado = c;
        this.clienteForm.patchValue({
          nombre: c.nombre,
          apellido: c.apellido,
          email: c.email,
          telefono: c.telefono,
          direccion: c.direccion
        });
      }, () => {
        this.mostrarToast('Error cargando cliente', 'danger');
      });
  }

  private cargarMascota(id: string) {
    this.http.get<any>(`${this.apiUrl}/mascotas/${id}`)
      .subscribe(m => {
        this.clienteForm.patchValue({
          mascotaNombre: m.nombre,
          mascotaEspecie: m.especie,
          mascotaRaza: m.raza,
          mascotaFechaNacimiento: m.fechaNacimiento,
          mascotaPeso: m.peso,
          mascotaCaracteristicas: m.caracteristicas
        });
      }, () => {
        this.mostrarToast('Error cargando mascota', 'danger');
      });
  }

  // ─── FormArray de mascotas adicionales ────────────────

  get mascotas(): FormArray {
    return this.clienteForm.get('mascotas') as FormArray;
  }

  crearMascota(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      peso: ['', Validators.required],
      caracteristicas: ['', Validators.required]
    });
  }

  // ─── MODO EXISTENTE ───────────────────────────────────

  buscarCliente() {
    const q = this.clienteForm.get('clienteBusqueda')!.value.trim();
    if (!q) {
      this.clientesFiltrados = [];
      return;
    }
    this.http.get<any[]>(`${this.apiUrl}/clientes?search=${encodeURIComponent(q)}`)
      .subscribe({
        next: res => {
          this.clientesFiltrados = res;
          if (res.length === 0) {
            this.mostrarToast('No se encontraron clientes', 'warning');
          }
        },
        error: () => {
          this.clientesFiltrados = [];
          this.mostrarToast('Error al buscar clientes', 'danger');
        }
      });
  }

  selectClienteExistente(c: any) {
    this.clienteSeleccionado = c;
    this.clienteForm.patchValue({
      clienteBusqueda: c.email,
      nombre: c.nombre,
      apellido: c.apellido,
      email: c.email,
      telefono: c.telefono,
      direccion: c.direccion
    });
    this.mostrarToast('Cliente seleccionado', 'success');
  }

  // ─── MODO NUEVO ───────────────────────────────────────

  async revisarCliente() {
    const data = this.clienteForm.value;

    // Sólo validar campos de mascota si ya hay cliente seleccionado
    if (this.clienteSeleccionado) {
      const campos = [
        'mascotaNombre',
        'mascotaEspecie',
        'mascotaRaza',
        'mascotaFechaNacimiento',
        'mascotaPeso',
        'mascotaCaracteristicas'
      ];
      if (campos.some(f => !data[f])) {
        return this.mostrarToast('Rellena los datos de la mascota', 'danger');
      }
    } else {
      this.clienteForm.markAllAsTouched();
      if (this.clienteForm.invalid) {
        return this.mostrarToast('Completa todos los campos de cliente y mascota', 'danger');
      }
    }

    const modal = await this.modalCtrl.create({
      component: ResumenClienteModalComponent,
      componentProps: { cliente: data }
    });
    await modal.present();

    const { data: result } = await modal.onDidDismiss();
    if (result?.confirmar) {
      this.crearCliente();
    }
  }

  async crearCliente() {
    const d = this.clienteForm.value;
    const mp = {
      nombre: d.mascotaNombre,
      especie: d.mascotaEspecie,
      raza: d.mascotaRaza,
      fechaNacimiento: d.mascotaFechaNacimiento,
      peso: d.mascotaPeso,
      caracteristicas: d.mascotaCaracteristicas
    };
    const extras = (d.mascotas as any[]).filter(m => m.nombre && m.especie && m.raza);

    // Si ya había cliente seleccionado, solo añadimos mascota
    if (this.clienteSeleccionado) {
      return this.agregarMascota(this.clienteSeleccionado._id);
    }

    // Nuevo cliente completo
    const payload = {
      nombre: d.nombre,
      apellido: d.apellido,
      email: d.email,
      telefono: d.telefono,
      direccion: d.direccion,
      mascotas: [mp, ...extras]
    };

    this.http.post(`${this.apiUrl}/clientes`, payload).subscribe({
      next: () => this.mostrarToast('Cliente registrado', 'success'),
      error: () => this.mostrarToast('Error registrando cliente', 'danger')
    });
  }

  async openMascotaPopover(ev: Event) {
    const pop = await this.popoverCtrl.create({
      component: PopoverMascotaPage,
      event: ev,
      translucent: true,
      cssClass: 'popover-mascota'
    });
    await pop.present();

    const { data } = await pop.onDidDismiss();
    if (data) {
      const grupo = this.crearMascota();
      grupo.patchValue(data);
      this.mascotas.push(grupo);
      this.mostrarToast('Mascota agregada', 'success');
    }
  }

  async agregarMascota(clienteId: string) {
    const d = this.clienteForm.value;
    const dto = {
      nombre: d.mascotaNombre,
      especie: d.mascotaEspecie,
      raza: d.mascotaRaza,
      fechaNacimiento: d.mascotaFechaNacimiento,
      peso: d.mascotaPeso,
      caracteristicas: d.mascotaCaracteristicas
    };
    this.http.post(`${this.apiUrl}/clientes/${clienteId}/mascota`, dto).subscribe({
      next: () => this.mostrarToast('Mascota añadida', 'success'),
      error: () => this.mostrarToast('Error al añadir mascota', 'danger')
    });
  }

  // ─── MODO EDITAR CLIENTE ───────────────────────────────

  confirmarEdicion() {
    if (!this.clienteIdParam) return;
    const payload = {
      nombre:    this.clienteForm.value.nombre,
      apellido:  this.clienteForm.value.apellido,
      email:     this.clienteForm.value.email,
      telefono:  this.clienteForm.value.telefono,
      direccion: this.clienteForm.value.direccion
    };
    this.http.put(`${this.apiUrl}/clientes/${this.clienteIdParam}`, payload)
      .subscribe({
        next: () => {
          this.mostrarToast('Cliente actualizado', 'success');
          this.navCtrl.back();   // ← vuelve al detalle
        },
        error: () => this.mostrarToast('Error actualizando cliente', 'danger')
      });
  }
  

  // ─── MODO EDITAR MASCOTA ──────────────────────────────

  confirmarEdicionMascota() {
    if (!this.mascotaIdParam) return;
    const payload = {
      nombre: this.clienteForm.value.mascotaNombre,
      especie: this.clienteForm.value.mascotaEspecie,
      raza: this.clienteForm.value.mascotaRaza,
      fechaNacimiento: this.clienteForm.value.mascotaFechaNacimiento,
      peso: this.clienteForm.value.mascotaPeso,
      caracteristicas: this.clienteForm.value.mascotaCaracteristicas
    };
    this.http.put(`${this.apiUrl}/mascotas/${this.mascotaIdParam}`, payload)
      .subscribe({
        next: () => {
          this.mostrarToast('Mascota actualizada', 'success');
          // Regresa a la pantalla anterior (detalle de la mascota en Consultas)
          this.navCtrl.back();
        },
        error: () => this.mostrarToast('Error actualizando mascota', 'danger')
      });
  }
  

  // ─── UTILIDADES ────────────────────────────────────────

  async mostrarToast(
    msg: string,
    color: 'success' | 'danger' | 'warning' = 'success'
  ) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'top' });
    await toast.present();
  }

  cancelar() {
    this.clienteForm.reset();
    this.mascotas.clear();
    this.clienteSeleccionado = null;
    this.clienteIdParam = undefined;
    this.mascotaIdParam = undefined;
    this.modoCliente = 'nuevo';
    this.mostrarToast('Operación cancelada', 'warning');
  }
}
