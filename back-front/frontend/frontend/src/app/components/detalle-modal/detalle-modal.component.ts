import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { NgIf, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-modal',
  templateUrl: './detalle-modal.component.html',
  styleUrls: ['./detalle-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    NgIf,
    NgFor,
    CommonModule
  ]
})
export class DetalleModalComponent {
  @Input() datos: any;

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj).filter(k => typeof obj[k] !== 'object' || obj[k] === null);
  }

  // Agrega estas funciones
  formatKey(key: string): string {
    const limpiar = key.replace(/^_/, '').replace(/([A-Z])/g, ' $1');
    return limpiar.charAt(0).toUpperCase() + limpiar.slice(1);
  }
  

getIconoPorCampo(campo: string): string {
  const mapa: any = {
    nombre: 'person',
    apellido: 'person-outline',
    email: 'mail',
    telefono: 'call',
    direccion: 'location',
    fechaNacimiento: 'calendar',
    especie: 'paw',
    raza: 'paw-outline',
    peso: 'barbell',
    _id: 'finger-print'
  };
  return mapa[campo] || 'information-circle-outline';
}

copiarAlPortapapeles(valor: string) {
  navigator.clipboard.writeText(valor).then(() => {
    console.log('📋 Copiado al portapapeles:', valor);
  });
}


}
