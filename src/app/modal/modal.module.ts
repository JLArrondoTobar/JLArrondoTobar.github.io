import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts/google-charts.module';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2GoogleChartsModule,
    AutocompleteLibModule,
    RouterModule.forChild([{ path: '', component: ModalComponent }])
  ],
  declarations: [ModalComponent]
})
export class ModalModule { }
