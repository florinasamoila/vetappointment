import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ClienteService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-add-more-pets-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-more-pets-modal.component.html',
  styleUrls: ['./add-more-pets-modal.component.scss'],
})
export class AddMorePetsModalComponent implements OnInit {
  @Input() cliente!: any;
  mascotas: any[] = [];
  petForm = this.fb.group({
    nombre:          ['', Validators.required],
    especie:         ['', Validators.required],
    raza:            ['', Validators.required],
    edad:            [null, [Validators.required, Validators.min(0)]],
    sexo:            ['', Validators.required],
    color:           ['', Validators.required],
    peso:            [null, [Validators.required, Validators.min(0)]],
    caracteristicas: ['']
  });

  constructor(
    private modalCtrl: ModalController,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private toastCtrl: ToastController         // ← Inyectamos el ToastController
  ) {}

  ngOnInit() {
    this.clienteService
      .obtenerMascotasPorCliente(this.cliente._id)
      .subscribe((list: any[]) => this.mascotas = list);
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async guardarMascota() {
    if (this.petForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, completa todos los campos.',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
      return;
    }
    const dto: any = this.petForm.value;
    this.clienteService.agregarMascota(this.cliente._id, dto).subscribe({
      next: async (newPet: any) => {
        this.mascotas.push(newPet);
        this.petForm.reset();
        const toast = await this.toastCtrl.create({
          message: 'Mascota agregada exitosamente.',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Error al agregar la mascota.',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    });
  }
}
