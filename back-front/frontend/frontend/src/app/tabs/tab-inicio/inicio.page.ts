import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonPopover } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { HeaderComponent } from 'src/app/components/header/header.component';


@Component({
  selector: 'app-tab1',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, HeaderComponent,IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonButton, CommonModule, IonPopover
  ],
})
export class TabInicio {
  longText: string = "Llevar historial médico y evitar que coma 2 horas antes. Si el animal presenta síntomas adversos después de la vacuna, contactar al veterinario de inmediato para recibir asistencia y seguimiento adecuado." 
  constructor() {}

  
}
