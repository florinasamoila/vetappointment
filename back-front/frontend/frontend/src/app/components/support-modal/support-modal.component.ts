import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonicModule,
  ModalController,
  IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton,
  IonContent, IonItem, IonLabel,
  IonInput, IonTextarea
} from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-support-modal',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, ReactiveFormsModule, CommonModule, FormsModule,],
  templateUrl: './support-modal.component.html',
  styleUrls: ['./support-modal.component.scss'],
})
export class SupportModalComponent {
  subject = '';
  message = '';

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  send() {
    const mailto = `mailto:soporte@vetappointment.com`
      + `?subject=${encodeURIComponent(this.subject)}`
      + `&body=${encodeURIComponent(this.message)}`;
    window.open(mailto, '_blank');
    this.dismiss();
  }
}
