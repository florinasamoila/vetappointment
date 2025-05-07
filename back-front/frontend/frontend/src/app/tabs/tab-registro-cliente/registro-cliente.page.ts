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
import { AddMorePetsModalComponent } from 'src/app/components/add-more-pets-modal/add-more-pets-modal.component';


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
    AddMorePetsModalComponent
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
      mascotaNombre:           ['', Validators.required],
      mascotaEspecie:          ['', Validators.required],
      mascotaRaza:             ['', Validators.required],
      mascotaEdad:             [null, [Validators.required, Validators.min(0)]],
      mascotaSexo:             ['', Validators.required],
      mascotaColor:            ['', Validators.required],
      mascotaFechaNacimiento:  ['', Validators.required],
      mascotaPeso:             [null, [Validators.required, Validators.min(0)]],
      mascotaCaracteristicas:  ['', Validators.required],
      mascotas:                this.fb.array([])
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
      nombre:          ['', Validators.required],
      especie:         ['', Validators.required],
      raza:            ['', Validators.required],
      edad:            [null, [Validators.required, Validators.min(0)]],
      sexo:            ['', Validators.required],
      color:           ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      peso:            [null, [Validators.required, Validators.min(0)]],
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
    // Primer mascota
    const mascotaPrincipal = {
      nombre:          d.mascotaNombre,
      especie:         d.mascotaEspecie,
      raza:            d.mascotaRaza,
      edad:            +d.mascotaEdad,
      sexo:            d.mascotaSexo,
      color:           d.mascotaColor,
      fechaNacimiento: d.mascotaFechaNacimiento,
      peso:            +d.mascotaPeso,
      caracteristicas: d.mascotaCaracteristicas
    };
    // Extras si hay FormArray
    const extras = (d.mascotas as any[])
      .filter(m => m.nombre && m.especie && m.raza)
      .map(m => ({
        nombre:          m.nombre,
        especie:         m.especie,
        raza:            m.raza,
        edad:            +m.edad,
        sexo:            m.sexo,
        color:           m.color,
        fechaNacimiento: m.fechaNacimiento,
        peso:            +m.peso,
        caracteristicas: m.caracteristicas
      }));
  
    const payload = {
      nombre:   d.nombre,
      apellido: d.apellido,
      email:    d.email,
      telefono: d.telefono,
      direccion:d.direccion,
      mascotas: [mascotaPrincipal, ...extras]
    };
  
    this.http.post(`${this.apiUrl}/clientes`, payload).subscribe({
      next: () => {
        this.mostrarToast('Cliente creado exitosamente', 'success');
        this.clienteForm.reset();          // ← Añadir esto aquí
        this.mascotas.clear();             // ← Limpia las mascotas adicionales
        this.clienteSeleccionado = null;   // ← Limpia la selección previa si existe
      },
      error: () => this.mostrarToast('Error al crear cliente', 'danger')
    });
  }
  

  async openAddMorePetsModal() {
    if (this.modoCliente !== 'existente' || !this.clienteSeleccionado) {
      return;
    }
    const modal = await this.modalCtrl.create({
      component: AddMorePetsModalComponent,
      componentProps: { cliente: this.clienteSeleccionado },
      cssClass: 'add-more-pets-modal'
    });
    await modal.present();
  
    // Si necesitas hacer algo al cerrar:
     const { data } = await modal.onDidDismiss();
  }

  async agregarMascota(clienteId: string) {
    const d = this.clienteForm.value;
    const dto = {
      nombre:          d.mascotaNombre,
      especie:         d.mascotaEspecie,
      raza:            d.mascotaRaza,
      edad:            +d.mascotaEdad,
      sexo:            d.mascotaSexo,
      color:           d.mascotaColor,
      fechaNacimiento: d.mascotaFechaNacimiento,
      peso:            +d.mascotaPeso,
      caracteristicas: d.mascotaCaracteristicas
    };
    this.http.post(`${this.apiUrl}/clientes/${clienteId}/mascota`, dto).subscribe({
      next: () => this.mostrarToast('Mascota agregada exitosamente', 'success'),
      error: () => this.mostrarToast('Error al agregar mascota', 'danger')
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
    const d = this.clienteForm.value;
    const payload = {
      nombre:          d.mascotaNombre,
      especie:         d.mascotaEspecie,
      raza:            d.mascotaRaza,
      edad:            +d.mascotaEdad,
      sexo:            d.mascotaSexo,
      color:           d.mascotaColor,
      fechaNacimiento: d.mascotaFechaNacimiento,
      peso:            +d.mascotaPeso,
      caracteristicas: d.mascotaCaracteristicas
    };
    this.http.put(`${this.apiUrl}/mascotas/${this.mascotaIdParam}`, payload).subscribe({
      next: () => this.mostrarToast('Mascota actualizada', 'success'),
      error: () => this.mostrarToast('Error actualizando mascota', 'danger')
    });
  }
  
  

  // ─── UTILIDADES ────────────────────────────────────────

  async mostrarToast(
    msg: string,
    color: 'success' | 'danger' | 'warning' = 'success'
  ) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color, position: 'middle' });
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
