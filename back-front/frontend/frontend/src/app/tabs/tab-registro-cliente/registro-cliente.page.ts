import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSearchbar, IonList, IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonButton, IonTextarea, PopoverController } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PopoverMascotaPage } from 'src/app/pages/popover-mascota/popover-mascota.page';




@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: 'registro-cliente.page.html',
  styleUrls: ['registro-cliente.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, HeaderComponent, CommonModule, FullCalendarModule, IonGrid, IonRow, IonCol, IonSearchbar, IonList,
    IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonButton, ReactiveFormsModule, HttpClientModule,
    FormsModule, IonTextarea
  ],
})
export class TabRegistroCliente {
  clienteForm: FormGroup;
  apiUrl = 'http://localhost:3000/veterinaria'; 

  

  constructor(private fb: FormBuilder, private http: HttpClient, private popoverCtrl: PopoverController) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      mascotas: this.fb.array([]), // 📌 Arreglo de mascotas
    });
  }

  async abrirPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverMascotaPage,
      event,
      translucent: true,
      cssClass: 'popover-fullscreen', // 🔥 Clase que aplica el tamaño completo
      showBackdrop: true,
    });
  
    await popover.present();
    const { data } = await popover.onDidDismiss();
  
    // 📌 Si hay datos, añadirlos correctamente al FormArray
    if (data) {
      const form = this.fb.group({
        nombre: [data.nombre || '', Validators.required],
        especie: [data.especie || '', Validators.required],
        raza: [data.raza || '', Validators.required],
        edad: [data.edad || '', Validators.required],
        sexo: [data.sexo || '', Validators.required],
        color: [data.color || '', Validators.required],
        peso: [data.peso || '', Validators.required],
        caracteristicas: [data.caracteristicas || ''],
        fechaNacimiento: [data.fechaNacimiento || '']
      });
      this.mascotas.push(form);
    }
    
  }
  

  get mascotas(): FormArray {
    return this.clienteForm.get('mascotas') as FormArray;
  }

  cancelar() {
    this.clienteForm.reset();
  }

  // 📌 Agregar una nueva Mascota antes de enviar
  agregarMascota() {
    const mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      sexo: ['', Validators.required],
      color: ['', Validators.required],
      peso: ['', [Validators.required, Validators.min(0)]],
      caracteristicas: [''],
      fechaNacimiento: [''], // No required
    });
  
    this.mascotas.push(mascotaForm);
    console.log('✅ Mascota agregada:', mascotaForm.value);
    console.log('📌 Mascotas actuales en el formulario:', this.mascotas.value);
  }
  
  
  

  eliminarMascota(index: number) {
    this.mascotas.removeAt(index);
  }

    // 📌 Crear Cliente y Mascotas en una sola acción
    async crearCliente() {
      if (this.clienteForm.valid) {
        const { mascotas, ...clienteFormSinMascotas } = this.clienteForm.value;
    
        console.log('📌 Enviando cliente sin mascotas:', clienteFormSinMascotas);
    
        this.http.post(`${this.apiUrl}/clientes`, clienteFormSinMascotas).subscribe(
          (cliente: any) => {
            const clienteId = cliente._id;
            console.log('✅ Cliente creado:', cliente);
    
            const mascotasConCliente = this.mascotas.value.map((mascota: any) => {
              const mascotaLimpia = { ...mascota };
            
              // Si fechaNacimiento está vacío o undefined, se elimina
              if (!mascotaLimpia.fechaNacimiento) {
                delete mascotaLimpia.fechaNacimiento;
              }
            
              return {
                ...mascotaLimpia,
                cliente: clienteId
              };
            });
            
    
            console.log('📦 Mascotas con cliente ID:', mascotasConCliente);
            this.registrarMascotas(mascotasConCliente);
          },
          (error) => console.error('❌ Error al registrar el cliente:', error)
        );
      } else {
        console.log('❌ Formulario inválido');
      }
    }
    
    
    
    
    
  
    registrarMascotas(mascotas: any[]) {
      mascotas.forEach((mascota) => {
        this.http.post(`${this.apiUrl}/mascotas`, mascota).subscribe(
          (respuesta) => console.log('✅ Mascota registrada:', respuesta),
          (error) => console.error('❌ Error al registrar mascota:', error)
        );
      });
    
      this.clienteForm.reset();
      this.mascotas.clear();
    }
    
    
    
}
