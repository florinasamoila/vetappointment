import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ModalController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-resumen-cliente-modal',
  templateUrl: './resumen-cliente-modal.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ResumenClienteModalComponent {
  @Input() cliente: any;

  constructor(private modalCtrl: ModalController) {}

  confirmar() {
    this.modalCtrl.dismiss({ confirmar: true });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  isCampoInvalido(valor: any): boolean {
    return !valor || valor === '';
  }
}
