import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, PopoverController } from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ExploreContainerComponent } from 'src/app/explore-container/explore-container.component';

@Component({
  selector: 'app-popover-mascota',
  templateUrl: './popover-mascota.page.html',
  styleUrls: ['./popover-mascota.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, HeaderComponent, CommonModule, FullCalendarModule, IonGrid, IonRow, IonCol, IonSearchbar, IonList,
      IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonButton, ReactiveFormsModule, HttpClientModule,
      FormsModule, IonTextarea, IonIcon, IonButtons, IonFooter
    ],
})
export class PopoverMascotaPage implements OnInit {
  mascotaForm: FormGroup;

  constructor(private fb: FormBuilder, private popoverCtrl: PopoverController) {
    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      sexo: ['', Validators.required],
      color: ['', Validators.required],
      peso: ['', [Validators.required, Validators.min(0)]],
      observaciones: [''],
      caracteristicas: [''], // ✅ añadir
      fechaNacimiento: [''], // ✅ añadir
    });
  }

  guardarMascota() {
    if (this.mascotaForm.valid) {
      this.popoverCtrl.dismiss(this.mascotaForm.value);
    }
  }

  cerrarPopover() {
    this.popoverCtrl.dismiss();
  }

  ngOnInit() {
  }

}
