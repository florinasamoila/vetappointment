import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-formulario-entrada-historial',
  templateUrl: './formulario-entrada-historial.component.html',
  styleUrls: ['./formulario-entrada-historial.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class FormularioEntradaHistorialComponent implements OnInit {
  @Input() mascotaID!: string;
  @Input() citaID!: string;
  @Input() veterinarioID!: string;

  // Variable para almacenar la cita seleccionada
  citaSeleccionada: any = null;

  // Variable para la nueva entrada
  entrada = {
    cita: '',
    veterinario: '',
    fecha: new Date().toISOString(),
    diagnosticos: '',
    tratamientos: '',
    observaciones: '',
  };

  private apiUrl = environment.apiUrl;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Obtener la cita por ID y asignarla a la variable citaSeleccionada
    this.http
      .get(`${this.apiUrl}/citas/${this.citaID}`)
      .subscribe((cita: any) => {
        this.citaSeleccionada = cita;

        // Llenar los campos del formulario con los datos de la cita
        this.entrada.cita = this.citaID;
        this.entrada.veterinario = this.veterinarioID; // Asumiendo que el veterinario ya se pasa correctamente
      });
  }

  // Método para guardar la entrada del historial médico
  guardar() {
    if (
      !this.entrada.diagnosticos ||
      !this.entrada.tratamientos ||
      !this.entrada.observaciones
    ) {
      alert('Por favor, complete todos los campos');
      return;
    }

    this.http
      .post(
        `${this.apiUrl}/historial-medico/${this.mascotaID}/entrada`,
        this.entrada
      )
      .subscribe({
        next: (response) => {
          console.log('Entrada guardada con éxito', response);
          this.modalCtrl.dismiss(response); // Cerrar el modal y pasar los datos guardados
        },
        error: (err) => {
          console.error('Error al guardar la entrada', err);
          alert('Hubo un error al guardar la entrada. Intenta nuevamente.');
        },
      });
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }
}
