import { Component, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { Tipster } from '../shared/tipster';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';
import { AlertService } from '../services/alert/alert.service';
import { IonList } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('tipstersList', {static: false}) 
  tipsterList: IonList;

  isMenuOpen: boolean;

  totalTipsters: Array<Tipster>;
  reOrderList: number;

  constructor(private route: ActivatedRoute,
              private storageService: StorageService, 
              private alertService: AlertService,
              private router: Router) {
      this.totalTipsters = this.storageService.createIfNotExists(this.totalTipsters);
      this.route.queryParams.subscribe(params => {
        if(this.router.getCurrentNavigation()){
          if (this.router.getCurrentNavigation().extras.state) {
            this.reOrderList = this.router.getCurrentNavigation().extras.state.reOrderList;
            if(this.reOrderList > 0){
              this.totalTipsters = this.storageService.load();
            }
          }
        }
      });
      this.isMenuOpen = false;
  }

  closeItemOptions(){
    this.tipsterList.closeSlidingItems();
    this.isMenuOpen = false;
  }

  logDrag(event: any) {
    this.isMenuOpen = true;
  }

  accessTipster(tipsterSelected: Tipster, index: number){
    if(!this.isMenuOpen){
      let navigationExtras: NavigationExtras = {
        state: {
          tipsterSelected: tipsterSelected,
          reOrderList: 0
        }
      };
      this.router.navigate(['bets'], navigationExtras);
    }
  }

  deleteTipster(i: number){
    event.stopPropagation();
    this.closeItemOptions();
    this.alertService.presentAlertDeleteTipster(this.totalTipsters, i);
  }

  presentModalCreateTipster(){
    let navigationExtras: NavigationExtras = {
      state: {
        chartType: 'addTipster'
      }
    };
    this.router.navigate(['modal'], navigationExtras);
  }

  presentModalEditTipster(tipster: Tipster){
    this.closeItemOptions();
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: tipster,
        chartType: 'editTipster'
      }
    };
    this.router.navigate(['modal'], navigationExtras);
  }

  presentModalSignOut(){
    this.alertService.presentAlertSingOut();
  }
}
