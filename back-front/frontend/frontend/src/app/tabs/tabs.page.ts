import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, personAdd, calendar, home, barChart, closeOutline, search, close, eye, copyOutline, person, personOutline, barbell, call, fingerPrint, mail, paw, pawOutline, informationCircleOutline, chevronBack, chevronForward, createOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonButtons, IonIcon],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ home, calendar, personAdd, barChart, close, search, eye, copyOutline, person, 
      personOutline, mail, call, paw, pawOutline, barbell, fingerPrint, informationCircleOutline,
      chevronForward, chevronBack, createOutline });
  }
}
