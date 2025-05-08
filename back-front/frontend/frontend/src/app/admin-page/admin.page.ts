import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  ToastController,
} from '@ionic/angular/standalone';
import {
  Veterinario,
  VeterinarioService,
} from '../services/veterinario.service';
import {
  ServicioPrestado,
  ServicioPrestadoService,
} from '../services/servicio-prestado.service';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class AdminPage implements OnInit {
  veterinarios: Veterinario[] = [];
  servicios: ServicioPrestado[] = [];

  // Formularios
  vetForm: Partial<Veterinario> = {};
  servForm: Partial<ServicioPrestado> = {};

  // IDs seleccionados
  selectedVetId: string | null = null;
  selectedServiceId: string | null = null;

  // Para editar
  editingVetId: string | null = null;
  editingServId: string | null = null;

  constructor(
    private vetService: VeterinarioService,
    private servService: ServicioPrestadoService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadVeterinarios();
    this.loadServicios();
  }

  loadVeterinarios(search?: string) {
    this.vetService
      .getAll(search)
      .subscribe((list) => (this.veterinarios = list));
  }

  loadServicios(search?: string) {
    this.servService
      .getAll(search)
      .subscribe((list) => (this.servicios = list));
  }

  /**
   * Guardar o actualizar veterinario
   */
  saveVeterinario() {
    const action = this.editingVetId
      ? this.vetService.update(this.editingVetId, this.vetForm as any)
      : this.vetService.create(this.vetForm as any);

    action.subscribe(() => {
      this.resetVetForm();
      this.selectedVetId = null;
      this.loadVeterinarios();
      this.presentToast(
        this.editingVetId ? 'Veterinario actualizado' : 'Veterinario creado',
        this.editingVetId ? 'warning' : 'success'
      );
    });
  }

  deleteVeterinario(id: string) {
    if (!id) {
      return;
    }
    if (confirm('¿Seguro que quieres borrar este veterinario?')) {
      this.vetService.delete(id).subscribe(() => {
        this.resetVetForm();
        this.selectedVetId = null;
        this.loadVeterinarios();
        this.presentToast('Veterinario eliminado', 'danger');
      });
    }
  }

  resetVetForm() {
    this.editingVetId = null;
    this.vetForm = {};
  }

  /**
   * Guardar o actualizar servicio prestado
   */
  saveServicio() {
    const action = this.editingServId
      ? this.servService.update(this.editingServId, this.servForm as any)
      : this.servService.create(this.servForm as any);

    action.subscribe(() => {
      this.resetServForm();
      this.selectedServiceId = null;
      this.loadServicios();
      this.presentToast(
        this.editingServId ? 'Servicio actualizado' : 'Servicio creado',
        this.editingServId ? 'warning' : 'success'
      );
    });
  }

  deleteServicio(id: string) {
    if (!id) {
      return;
    }
    if (confirm('¿Seguro que quieres borrar este servicio?')) {
      this.servService.delete(id).subscribe(() => {
        this.resetServForm();
        this.selectedServiceId = null;
        this.loadServicios();
        this.presentToast('Servicio eliminado', 'danger');
      });
    }
  }

  resetServForm() {
    this.editingServId = null;
    this.servForm = {};
  }

  /**
   * Manejadores de selección: pasan al modo edición y pueblan el formulario
   */
  onVetSelectChange() {
    if (this.selectedVetId) {
      const vet = this.veterinarios.find((v) => v._id === this.selectedVetId)!;
      this.editingVetId = vet._id;
      this.vetForm = { ...vet };
    } else {
      this.resetVetForm();
    }
  }

  onServiceSelectChange() {
    if (this.selectedServiceId) {
      const serv = this.servicios.find(
        (s) => s._id === this.selectedServiceId
      )!;
      this.editingServId = serv._id;
      this.servForm = { ...serv };
    } else {
      this.resetServForm();
    }
  }
  // Método auxiliar
  private async presentToast(
    message: string,
    color: 'success' | 'warning' | 'danger'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
