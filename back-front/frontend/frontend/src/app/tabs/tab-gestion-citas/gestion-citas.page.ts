import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonDatetime, IonGrid, IonInput, IonItem, IonLabel, IonList, IonRow, IonSearchbar, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-tab2',
  templateUrl: 'gestion-citas.page.html',
  styleUrls: ['gestion-citas.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, HeaderComponent, CommonModule, FullCalendarModule, IonGrid, IonRow, IonCol, IonSearchbar, IonList,
      IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonButton
    ],
})
export class TabGestionCitas {

  

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    editable: true,
    events: [
      { title: 'Consulta de Firulais', date: '2025-02-27' },
      { title: 'Vacunación de Luna', date: '2025-02-28' }
    ]
  };

  clientes = ['Juan Pérez', 'Ana López', 'Carlos Torres', 'María Gómez'];
  clientesFiltrados = [...this.clientes];

  buscarCliente(event: any) {
    const texto = event.target.value.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.toLowerCase().includes(texto)
    );
  }

  constructor() {}

}
