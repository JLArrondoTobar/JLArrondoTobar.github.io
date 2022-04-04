import { Component, OnInit, Renderer2, ElementRef, QueryList, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Tipster } from 'src/app/shared/tipster';
import { Bet } from 'src/app/shared/bet';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { TipsterService } from 'src/app/services/tipster/tipster.service';
import { BetService } from 'src/app/services/bet/bet.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { IonList } from '@ionic/angular';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss'],
})
export class BetsComponent implements OnInit {

  @ViewChildren('valueLabelContainerDescription', { read: ElementRef }) 
  valueLabelContainerDescriptions: QueryList<any>;

  @ViewChild('betsList', {static: false}) 
  betsList: IonList;

  tipsterSelected: Tipster;
  totalActiveBets: Array<Bet> = new Array<Bet>();
  isBetMenu: boolean;
  isDeterminedMenu: boolean;
  totalDeterminedBets: Array<Bet> = new Array<Bet>();
  isActiveBets: boolean;
  betRowNumber: number;
  totalTipsters: Array<Tipster>;
  isMenuOpen: boolean;
  reOrderList: number;

  isFilterActivated: boolean;

  constructor(private route: ActivatedRoute, private router: Router, 
              private tipsterService: TipsterService, private betService: BetService,
              private storageService: StorageService, private alertService: AlertService,
              public renderer: Renderer2, private changeDetector : ChangeDetectorRef) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.tipsterSelected = this.router.getCurrentNavigation().extras.state.tipsterSelected;
        this.reOrderList = this.router.getCurrentNavigation().extras.state.reOrderList;
        if(this.reOrderList > 0){
          this.totalTipsters = this.storageService.load();
          //this.isFilterActivated = true;
          this.pushToDeterminedListInOrder();
        }
        if(this.reOrderList > 1){
          this.alertService.presentToast('Filter Enabled', 1000, 'error');
        }
        this.checkOverflowForTotalDescriptions();
      }
    });
    this.isBetMenu = false;
    this.isDeterminedMenu = false;
    this.isActiveBets = true;
    this.isMenuOpen = false;
  }

  ngOnInit(): void {
    this.pushToDeterminedListInOrder();
    this.totalTipsters = this.storageService.load();
    this.tipsterSelected.tipsterBets.forEach(bet => {this.betService.addToTotalActiveBets(this.totalActiveBets, bet);});
    this.tipsterSelected.picksInPlay = this.tipsterSelected.totalLostBets.length + this.tipsterSelected.totalHalfLostBets.length + this.tipsterSelected.totalNullBets.length + this.tipsterSelected.totalWonBets.length + this.tipsterSelected.totalHalfWonBets.length;
  }

  pushToDeterminedListInOrder(){
    this.totalDeterminedBets = new Array<Bet>();
    if(this.tipsterSelected.filterDatesRange.length === 0){
      this.tipsterSelected.determinedBetsOrderList.forEach(element => {
        if(element === -2){
          this.tipsterSelected.totalHalfLostBets.forEach(element => {this.addToDeterminedBets(element);});
        } else if(element === -1){
          this.tipsterSelected.totalLostBets.forEach(element => {this.addToDeterminedBets(element);});
        } else if(element === 0){
          this.tipsterSelected.totalNullBets.forEach(element => {this.addToDeterminedBets(element);});
        } else if(element === 1){
          this.tipsterSelected.totalWonBets.forEach(element => {this.addToDeterminedBets(element);});
        } else {
          this.tipsterSelected.totalHalfWonBets.forEach(element => {this.addToDeterminedBets(element);});
        }
      });
    } else if(this.tipsterSelected.filterDatesRange.length === 1){
      this.tipsterSelected.filterDatesRange[0] = new Date(this.tipsterSelected.filterDatesRange[0]);
      this.tipsterSelected.determinedBetsOrderList.forEach(element => {
        if(element === -2){
          this.tipsterSelected.totalHalfLostBets.forEach(element => {
            if (new Date(element.betDate).getTime() === new Date(this.tipsterSelected.filterDatesRange[0]).getTime()){
              this.addToDeterminedBets(element);
            }
        });
        } else if(element === -1){
          this.tipsterSelected.totalLostBets.forEach(element => {
            if (new Date(element.betDate).getTime() === new Date(this.tipsterSelected.filterDatesRange[0]).getTime()){
              this.addToDeterminedBets(element);
            }});
        } else if(element === 0){
          this.tipsterSelected.totalNullBets.forEach(element => {
            if (new Date(element.betDate).getTime() === new Date(this.tipsterSelected.filterDatesRange[0]).getTime()){
              this.addToDeterminedBets(element);
            }
          });
        } else if(element === 1){
          this.tipsterSelected.totalWonBets.forEach(element => {
            if (new Date(element.betDate).getTime() === this.tipsterSelected.filterDatesRange[0].getTime()){
              this.addToDeterminedBets(element);
            }
          });
        } else {
          this.tipsterSelected.totalHalfWonBets.forEach(element => {
            if (new Date(element.betDate).getTime() === new Date(this.tipsterSelected.filterDatesRange[0]).getTime()){
              this.addToDeterminedBets(element);
            }
          });
        }
      });
    } else if (this.tipsterSelected.filterDatesRange.length === 2) {
      this.tipsterSelected.filterDatesRange[0] = new Date(this.tipsterSelected.filterDatesRange[0]);
      this.tipsterSelected.filterDatesRange[1] = new Date(this.tipsterSelected.filterDatesRange[1]);
      this.tipsterSelected.determinedBetsOrderList.forEach(element => {
        if(element === -2){
          this.tipsterSelected.totalHalfLostBets.forEach(element => {
            if (new Date(element.betDate).getTime() >= new Date(this.tipsterSelected.filterDatesRange[0]).getTime() 
              && new Date(element.betDate).getTime() <= new Date(this.tipsterSelected.filterDatesRange[1]).getTime()){
              this.addToDeterminedBets(element);
            }
        });
        } else if(element === -1){
          this.tipsterSelected.totalLostBets.forEach(element => {
            if (new Date(element.betDate).getTime() >= new Date(this.tipsterSelected.filterDatesRange[0]).getTime()
            && new Date(element.betDate).getTime() <= new Date(this.tipsterSelected.filterDatesRange[1]).getTime()){
              this.addToDeterminedBets(element);
            }});
        } else if(element === 0){
          this.tipsterSelected.totalNullBets.forEach(element => {
            if (new Date(element.betDate).getTime() >= new Date(this.tipsterSelected.filterDatesRange[0]).getTime()
            && new Date(element.betDate).getTime() <= new Date(this.tipsterSelected.filterDatesRange[1]).getTime()){
              this.addToDeterminedBets(element);
            }
          });
        } else if(element === 1){
          this.tipsterSelected.totalWonBets.forEach(element => {
            if (new Date(element.betDate).getTime() >= this.tipsterSelected.filterDatesRange[0].getTime()
            && new Date(element.betDate).getTime() <= new Date(this.tipsterSelected.filterDatesRange[1]).getTime()){
              this.addToDeterminedBets(element);
            }
          });
        } else {
          this.tipsterSelected.totalHalfWonBets.forEach(element => {
            if (new Date(element.betDate).getTime() >= new Date(this.tipsterSelected.filterDatesRange[0]).getTime()
            && new Date(element.betDate).getTime() <= new Date(this.tipsterSelected.filterDatesRange[1]).getTime()){
              this.addToDeterminedBets(element);
            }
          });
        }
      });
    }
  }

  resetFilter(){
    this.tipsterSelected.hasFilterActivated = false;
    this.tipsterSelected.determinedBetsOrderList = [1, -1, 0, 2, -2];
    this.tipsterSelected.filterDatesRange = new Array<Date>();
    this.pushToDeterminedListInOrder();
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters);
    this.alertService.presentToast('Filter Disabled', 1000, 'error');
  }

  closeItemOptions(){
    this.betsList.closeSlidingItems();
    this.isMenuOpen = false;
  }

  logDrag(event: any) {
    this.isMenuOpen = true;
  }

  checkOverflowForTotalDescriptions(){
    this.changeDetector.detectChanges();
    setTimeout(() => { this.valueLabelContainerDescriptions.forEach(element => this.checkOverflow(element)); }, 100);
  }

  checkOverflow(element){
    /*console.log(element);
    console.log(element.nativeElement.offsetWidth);
    console.log(element.nativeElement.scrollWidth);*/
    if(element.nativeElement.scrollWidth > 271.8){
      element.nativeElement.classList.remove("descriptionContainer");
      element.nativeElement.classList.add("descriptionOverflowContainer");
    } else {
      element.nativeElement.classList.remove("descriptionOverflowContainer");
      element.nativeElement.classList.add("descriptionContainer");
    }
  }
  
  goToActiveBets(){
    setTimeout(() => {this.checkOverflowForTotalDescriptions();}, 100);
    this.isActiveBets = true;
    this.closeFloatDeterminedMenu();
  }

  goToDeterminedBets(){
    setTimeout(() => {this.checkOverflowForTotalDescriptions();}, 100);
    this.isActiveBets = false;
    this.pushToDeterminedListInOrder();
    this.closeFloatBetMenu();
  }

  presentAlertDeleteBet(bet: Bet){
    this.alertService.presentAlertDeleteBet(this.totalTipsters, this.tipsterSelected, this.totalActiveBets, bet);
  }

  openFloatBetMenu(i: any){
    event.stopPropagation();
    if(!this.isMenuOpen){
      this.betRowNumber = i;
      if(this.isBetMenu){
        this.isBetMenu = false;
      } else {
        this.isBetMenu = true;
      }
    }
  }

  openFloatDeterminedMenu(i: any){
    event.stopPropagation();
    this.betRowNumber = i;
    if(this.isDeterminedMenu){
      this.isDeterminedMenu = false;
    } else {
      this.isDeterminedMenu = true;
    }
  }

  closeFloatBetMenu(){
    this.isBetMenu = false;
  }

  closeFloatDeterminedMenu(){
    this.isDeterminedMenu = false;
  }

  wonBet(bet: Bet){
    bet.betState = 1;
    bet.isActive = false;
    this.tipsterSelected.picksInPlay += 1;
    this.addToDeterminedBets(bet);
    this.tipsterService.addToTotalWonBets(this.tipsterSelected, bet);
    this.betService.removeFromActiveBets(this.tipsterSelected.tipsterBets, bet);
    this.tipsterService.replaceConfirmedBet(this.tipsterSelected, bet);
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters)
    this.betService.removeFromActiveBets(this.totalActiveBets, bet);
    this.alertService.presentToast('Won Bet! Congratulations!', 1000, 'success');
    this.closeFloatBetMenu();
  }

  addToDeterminedBets(bet: Bet){
    this.totalDeterminedBets.push(bet);
  }

  nullBet(bet: Bet){
    bet.betState = 0;
    bet.isActive = false;
    this.tipsterSelected.picksInPlay += 1;
    this.tipsterService.addToTotalNullBets(this.tipsterSelected, bet);
    this.addToDeterminedBets(bet);
    this.betService.removeFromActiveBets(this.tipsterSelected.tipsterBets, bet);
    this.betService.removeFromActiveBets(this.totalActiveBets, bet);
    this.tipsterService.replaceConfirmedBet(this.tipsterSelected, bet);
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters)
    this.alertService.presentToast('Null Bet', 1000, 'warning');
    this.closeFloatBetMenu();
  }

  lostBet(bet: Bet){
    bet.betState = -1;
    bet.isActive = false;
    this.tipsterSelected.picksInPlay += 1;
    this.tipsterService.addToTotalLostBets(this.tipsterSelected, bet);
    this.addToDeterminedBets(bet);
    this.betService.removeFromActiveBets(this.totalActiveBets, bet);
    this.betService.removeFromActiveBets(this.tipsterSelected.tipsterBets, bet);
    this.tipsterService.replaceConfirmedBet(this.tipsterSelected, bet);
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters)
    this.alertService.presentToast('Lost Bet! Unlucky...', 1000, 'danger');
    this.closeFloatBetMenu();
  }

  halfLostBet(bet: Bet){
    bet.betState = -2;
    bet.isActive = false;
    this.tipsterSelected.picksInPlay += 1;
    this.addToDeterminedBets(bet);
    this.tipsterService.addToTotalHalfLostBets(this.tipsterSelected, bet);
    this.betService.removeFromActiveBets(this.totalActiveBets, bet);
    this.betService.removeFromActiveBets(this.tipsterSelected.tipsterBets, bet);
    this.tipsterService.replaceConfirmedBet(this.tipsterSelected, bet);
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters)
    this.alertService.presentToast('Half Lost Bet! Half Unlucky...', 1000, 'danger');
    this.closeFloatBetMenu();
  }

  halfWOnBet(bet: Bet){
    bet.betState = 2;
    bet.isActive = false;
    this.tipsterSelected.picksInPlay += 1;
    this.addToDeterminedBets(bet);
    this.tipsterService.addToTotalHalfWonBets(this.tipsterSelected, bet);
    this.betService.removeFromActiveBets(this.totalActiveBets, bet);
    this.betService.removeFromActiveBets(this.tipsterSelected.tipsterBets, bet);
    this.tipsterService.replaceConfirmedBet(this.tipsterSelected, bet);
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters)
    this.alertService.presentToast('Half Won Bet! Not Too Bad!', 1000, 'success');
    this.closeFloatBetMenu();
  }

  returnBet(bet: Bet){
    bet.isActive = true;
    this.tipsterSelected.picksInPlay -= 1;
    this.betService.removeFromDeterminedBets(this.totalDeterminedBets, bet);
    this.betService.addToTotalActiveBets(this.totalActiveBets, bet);
    this.tipsterService.returnBet(this.tipsterSelected, bet); 
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters)
    this.alertService.presentToast('Bet Returned!', 1000, 'medium');
    this.closeFloatDeterminedMenu();
    console.log('return ' + bet.uuidValue);
  }

  infoWinRate(){
    this.presentModalWinRate();
  }

  infoProfit(){
    this.presentModalProfit();
  }

  infoYield(){
    this.presentModalYield();
  }
  
  async presentModalWinRate() {
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        chartType: 'winRate'
      }
    };
    this.router.navigate(['modal'], navigationExtras);
  }


  async presentModalProfit() {
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        chartType: 'profit'
      }
    };
    this.router.navigate(['modal'], navigationExtras);
  }

  async presentModalYield() {
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        chartType: 'yield'
      }
    };
    this.router.navigate(['modal'], navigationExtras);
  }

  async presentModalCreateBet() {
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        chartType: 'addBet',
        totalActiveBets: this.totalActiveBets
      }
    };
    this.router.navigate(['modal'], navigationExtras);
  }

  async presentModalEditBet(bet: Bet) {
    this.isMenuOpen = false;
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        chartType: 'editBet',
        betSelected: bet
      }
    };
    this.router.navigate(['modal'], navigationExtras);
  }

  async filterDeterminedBets(bet: Bet) {
    this.isMenuOpen = false;
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        chartType: 'filterDeterminedBets',
      }
    };
    this.router.navigate(['modal'], navigationExtras);
  }

}
