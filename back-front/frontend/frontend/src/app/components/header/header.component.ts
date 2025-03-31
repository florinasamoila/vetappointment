import { Component, model, ModelSignal, OnInit } from '@angular/core';
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonMenuButton,
  IonRow,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, ellipsisHorizontal, ellipsisVertical, helpCircle, personCircle, search, star } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  imports: [IonButton, IonButtons, IonIcon, IonTitle, IonToolbar, IonContent, IonHeader, IonTitle, IonToolbar,IonCol, IonGrid, IonRow, IonAvatar],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent  implements OnInit {
  titulo: ModelSignal<string> = model.required();

  constructor() {
    addIcons({ create, ellipsisHorizontal, ellipsisVertical, helpCircle, personCircle, search, star });
   }

  ngOnInit() {}

}
