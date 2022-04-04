import { Component, OnInit, Input, ɵConsole, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { Tipster } from '../shared/tipster';
import { Bet } from '../shared/bet';
import { TipsterService } from '../services/tipster/tipster.service';
import { AlertService } from '../services/alert/alert.service';
import { StorageService } from '../services/storage/storage.service';
import { BetService } from '../services/bet/bet.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IonReorderGroup } from '@ionic/angular';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @ViewChild('sportsAutocomplete', {static: false})
  sportsAutocomplete: any;

  @ViewChild('bookiesAutocomplete', {static: false})
  bookiesAutocomplete: any;

  @ViewChild('preLivesAutocomplete', {static: false})
  preLiveAutocomplete: any;

  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;

  public totalBookies = [{ id: 1, bookie: 'bet365'},
                         { id: 2, bookie: 'bwin'},
                         { id: 3, bookie: 'William Hill'},
                         { id: 4, bookie: 'SPORTIUM'},
                         { id: 5, bookie: 'Codere'},
                         { id: 6, bookie: 'KIROLBET'},
                         { id: 7, bookie: 'RETAbet'},
                         { id: 8, bookie: 'BETWINNER'},
                         { id: 9, bookie: 'Betfair'},
                         { id: 10, bookie: 'Marathonbet'},
                         { id: 11, bookie: 'Interwetten'},
                         { id: 12, bookie: 'SBOBET'},
                         { id: 13, bookie: 'Betway'},
                         { id: 14, bookie: 'Luckia'}];
  public totalSports = [{id: 1, sport:'Football', src: '../../assets/icon/sports/football-icon.svg'},
                        {id: 2, sport:'Basketball', src: '../../assets/icon/sports/basketball-icon.svg'},
                        {id: 3, sport:'Tennis', src: '../../assets/icon/sports/tennis-ball.svg'},
                        {id: 4, sport:'Volleyball', src: '../../assets/icon/sports/volleyball_icon.svg'},
                        {id: 5, sport:'Formula 1', src: '../../assets/icon/sports/formula1-icon.svg'}, 
                        {id: 6, sport:'American Football', src: '../../assets/icon/sports/american-footbal-icon.svg'}, 
                        {id: 7, sport:'Baseball', src: '../../assets/icon/sports/baseball-icon.svg'}, 
                        {id: 8, sport:'Bowls', src: '../../assets/icon/sports/bowls-icon.svg'},
                        {id: 9, sport:'Boxing/MMA', src: '../../assets/icon/sports/boxing-mma-icon.svg'},
                        {id: 10, sport:'Cricket', src: '../../assets/icon/sports/cricket-icon.svg'},
                        {id: 11, sport:'Darts', src: '../../assets/icon/sports/darts-icon.svg'},
                        {id: 12, sport:'Esports', src: '../../assets/icon/sports/esports-icon.svg'},
                        {id: 13, sport:'Futsal', src: '../../assets/icon/sports/fusal-icon.svg'},
                        {id: 14, sport:'Gaelic Sports', src: ''},
                        {id: 15, sport:'Golf', src: '../../assets/icon/sports/golf-icon.svg'},
                        {id: 16, sport:'Greyhounds', src: '../../assets/icon/sports/greyhound-icon.svg'},
                        {id: 17, sport:'Horse Racing', src: '../../assets/icon/sports/horse-racing-icon.svg'},
                        {id: 18, sport:'Ice Hockey', src: '../../assets/icon/sports/hockey-icon.svg'},
                        {id: 19, sport:'Nascar', src: '../../assets/icon/sports/nascar-icon.svg'},
                        {id: 20, sport:'Rugby', src: '../../assets/icon/sports/rugby-icon.svg'},
                        {id: 21, sport:'Snooker', src: '../../assets/icon/sports/billar-icon.svg'},
                        {id: 22, sport:'Speedway', src: '../../assets/icon/sports/speedway-icon.svg'},
                        {id: 23 , sport:'Handball', src: '../../assets/icon/sports/handball-icon.svg'}];

  public preLive = [{id: 1, preLive:'Pre'},
                    {id: 2, preLive: 'Live'}];

  public betStateOrderList = [];

  keywordSport: string = 'sport';
  sportSearchWord: string = '';

  keywordBookie: string = 'bookie';
  bookieSearchWord: string = '';

  bookieSearchWordCreateBet: string;
  bookieSearchWordCreateTipster: string;

  preLiveSearchWordCreateBet: string;
  preLiveSearchWordCreateTipster: string;

  pieCharWinRate: GoogleChartInterface;
  columnChartProfit: GoogleChartInterface;
  areaChartYield: GoogleChartInterface;

  totalTipsters: Array<Tipster>;

  chartType: string;
  tipsterSelected: Tipster;
  determinedBetsYield: Array<Bet>;
  totalDeterminedBetsDates: Array<number>;
  totalDatesFiltered: Array<Date>;
  betDate: Date;

  sport: string;
  bookie: string;
  preLiveModel: string;
  oldtotalBetValue: number;
  oldTotalBetBenefit: number;
  totalActiveBets: Array<Bet>;

  chartTypeforView: number;
  betSelected: Bet;
  
  startDate: String = new Date().toISOString();
  today: String = new Date().toISOString();

  dateStartDate: Date;
  dateEndDate: Date;
  allTimeValue: boolean = false;

  betsOrderList: Array<number> = new Array<number>();
  tipsterLastBookiePlayed: string;

  constructor(private route: ActivatedRoute, private router: Router, 
              private tipsterService: TipsterService, private alertService: AlertService,
              private storageService: StorageService, private betService: BetService,
              private apiService: ApiService, private fb: FormBuilder) {
    this.totalDeterminedBetsDates = new Array<number>();
    this.totalDatesFiltered = new Array<Date>();
    this.determinedBetsYield = new Array<Bet>();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.tipsterSelected = this.router.getCurrentNavigation().extras.state.tipsterSelected;
        this.chartType = this.router.getCurrentNavigation().extras.state.chartType;
        this.betSelected = this.router.getCurrentNavigation().extras.state.betSelected;
        this.totalActiveBets = this.router.getCurrentNavigation().extras.state.totalActiveBets;
      }
    });
  }

  validatorFormCreateBet = this.fb.group({
    betDescription: ['', [Validators.required, 
                    Validators.maxLength(50)]],
    betStake: ['', [Validators.required,
                    Validators.min(0.1), Validators.max(10)]],
    betOdds: ['', [Validators.required,
                   Validators.min(1.001),Validators.max(100)]],
    betBookie: [],
    betPreLive: [],
    betSport: []
  });

  validatorFormCreateTipster = this.fb.group({
    tipsterName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)],],
    tipsterBank: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
    tipsterValuePerUnit: ['', [Validators.required, Validators.min(0.1), Validators.max(99999)]],
    tipsterCurrency: ['', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]],
    lastBookiePlayed: []
  });

  validatorFormEditTipster = this.fb.group({
    tipsterName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)],],
    tipsterBank: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
    tipsterValuePerUnit: ['', [Validators.required, Validators.min(0.1), Validators.max(99999)]],
    tipsterCurrency: ['', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]],
  });

  
  onSubmitCreateBet() {
    if(!this.validatorFormCreateBet.valid) {
      return false;
    } else {
      this.createBet();
    }
  }

  onSubmitEditBet(){
    if(!this.validatorFormCreateBet.valid) {
      return false;
    } else {
      this.editBet();
    }
  }

  onSubmitCreateTipser(){
    if(!this.validatorFormCreateTipster.valid) {
      return false;
    } else {
      this.createTipster();
      this.closeModalTipster();
    }
  }

  onSubmitEditTipster(){
    if(!this.validatorFormEditTipster.valid) {
      return false;
    } else {
      this.editTipster();
      this.closeModalTipster();
    }
  }

  ngOnInit() {
    this.totalTipsters = this.storageService.load();
  }

  allTimeDates(allTimeValue: boolean){
    this.allTimeValue = allTimeValue;
  }

  lostBetsCheckboxChange(lostBetsCheckboxValue: boolean){
    if(lostBetsCheckboxValue){
      this.betsOrderList.push(-1);
    } else {
      this.betsOrderList = this.betsOrderList.filter(item => item !== -1);
    }
  }

  halfLostBetsCheckboxChange(halfLostBetsCheckboxValue: boolean){
    if(halfLostBetsCheckboxValue){
      this.betsOrderList.push(-2);
    } else {
      this.betsOrderList = this.betsOrderList.filter(item => item !== -2);
    }
  }


  nullBetsCheckboxChange(nullBetsCheckboxValue: boolean){
    if(nullBetsCheckboxValue){
      this.betsOrderList.push(0);
    } else {
      this.betsOrderList = this.betsOrderList.filter(item => item !== 0);
    }
  }


  halfWonBetsCheckboxChange(halfWonBetsCheckboxValue: boolean){
    if(halfWonBetsCheckboxValue){
      this.betsOrderList.push(2);
    } else {
      this.betsOrderList = this.betsOrderList.filter(item => item !== 2);
    }
  }


  wonBetsCheckboxChange(wonBetsCheckboxValue: boolean){
    if(wonBetsCheckboxValue){
      this.betsOrderList.push(1);
    } else {
      this.betsOrderList = this.betsOrderList.filter(item => item !== 1);
    }
  }

  closeModalFilterBets(){
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        reOrderList: 2
      }
    };
    this.router.navigate(['bets'], navigationExtras);
  }

  closeModal(){
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        reOrderList: 1
      }
    };
    this.router.navigate(['bets'], navigationExtras);
  }

  closeModalNoReorder(){
    let navigationExtras: NavigationExtras = {
      state: {
        tipsterSelected: this.tipsterSelected,
        reOrderList: 0
      }
    };
    this.router.navigate(['bets'], navigationExtras);
  }

  closeModalTipster(){
    let navigationExtras: NavigationExtras = {
      state: {
        reOrderList: 1
      }
    };
    this.router.navigate([''], navigationExtras);
  }

  closeModalTipsterNoReorder(){
    let navigationExtras: NavigationExtras = {
      state: {
        reOrderList: 0
      }
    };
    this.router.navigate([''], navigationExtras);
  }

  ionViewDidEnter() {
    if (this.chartType === 'profit'){
      this.chartTypeforView = 1
      this.loadChartProfit();
    } else if(this.chartType === 'yield'){
      this.chartTypeforView = 2;
      this.loadChartYield()
    } else if (this.chartType === 'winRate'){
      this.chartTypeforView = 3;
      this.loadChartWinRate();
    } else if (this.chartType === 'addBet'){
      this.chartTypeforView = 4;
      this.bookieSearchWordCreateBet = this.tipsterSelected.lastBookiePlayed;
      this.preLiveSearchWordCreateBet = this.tipsterSelected.lastPreLivePlayed;
      this.validatorFormCreateBet.controls['betBookie'].setValue(this.tipsterSelected.lastBookiePlayed);
      this.validatorFormCreateBet.controls['betPreLive'].setValue(this.tipsterSelected.lastPreLivePlayed);
    } else if (this.chartType === 'editBet') {
      this.sport = this.betSelected.sport;
      this.bookie = this.betSelected.bookie;
      this.preLiveModel = this.betSelected.preLive;
      this.oldTotalBetBenefit = this.betSelected.totalBetBenefit;
      this.oldtotalBetValue = this.betSelected.totalBetValue;
      this.sportSearchWord = this.betSelected.sport;
      this.bookieSearchWord = this.betSelected.bookie;

      this.validatorFormCreateBet.controls['betDescription'].setValue(this.betSelected.description);
      this.validatorFormCreateBet.controls['betStake'].setValue(this.betSelected.stakeLevel);
      this.validatorFormCreateBet.controls['betOdds'].setValue(this.betSelected.quote);
      this.validatorFormCreateBet.controls['betBookie'].setValue(this.betSelected.bookie);
      this.validatorFormCreateBet.controls['betPreLive'].setValue(this.betSelected.preLive);
      this.validatorFormCreateBet.controls['betSport'].setValue(this.betSelected.sport);

      this.chartTypeforView = 5;
    } else if(this.chartType === 'filterDeterminedBets') {
      this.betStateOrderList = this.tipsterSelected.determinedBetsOrderList;
      this.chartTypeforView = 6;
    } else if(this.chartType === 'addTipster'){
      this.chartTypeforView = 7;
    } else {
      this.bookieSearchWordCreateTipster = this.tipsterSelected.lastBookiePlayed;
      this.validatorFormEditTipster.controls['tipsterName'].setValue(this.tipsterSelected.name);
      this.validatorFormEditTipster.controls['tipsterBank'].setValue(this.tipsterSelected.totalBank);
      this.validatorFormEditTipster.controls['tipsterCurrency'].setValue(this.tipsterSelected.currency);
      this.validatorFormEditTipster.controls['tipsterValuePerUnit'].setValue(this.tipsterSelected.valuePerUnit);
      this.tipsterLastBookiePlayed = this.tipsterSelected.lastBookiePlayed;
      this.chartTypeforView = 8;
    }
  }

  reorderDeterminedList(){
    this.tipsterSelected.hasFilterActivated = true;
    this.tipsterSelected.determinedBetsOrderList = this.betsOrderList;
    if(this.allTimeValue){
      this.tipsterSelected.filterDatesRange = new Array<Date>();
    } else {
      this.tipsterSelected.filterDatesRange = new Array<Date>();
      this.dateStartDate = new Date(new Date(this.startDate+'').getFullYear(), new Date(this.startDate+'').getMonth(), new Date(this.startDate+'').getDate());
      this.tipsterSelected.filterDatesRange.push(this.dateStartDate);
      if(this.dateEndDate){
        this.tipsterSelected.filterDatesRange.push(new Date(new Date(this.dateEndDate).getFullYear(), new Date(this.dateEndDate).getMonth(), new Date(this.dateEndDate).getDate()));
      }
    }
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters);
    this.closeModalFilterBets();
  }

  loadChartYield() {
    this.tipsterSelected.totalLostBets.forEach(bet => {
                  this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
                  this.determinedBetsYield.push(bet);
    });
    this.tipsterSelected.totalHalfLostBets.forEach(bet => {
          this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
          this.determinedBetsYield.push(bet);
    });
    this.tipsterSelected.totalNullBets.forEach(bet => {
          this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
          this.determinedBetsYield.push(bet);
    });
    this.tipsterSelected.totalHalfWonBets.forEach(bet => {
          this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
          this.determinedBetsYield.push(bet);
    });
    this.tipsterSelected.totalWonBets.forEach(bet => {
          this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
          this.determinedBetsYield.push(bet);
    });
    let uniqueTotalDates = Array.from(new Set(this.totalDeterminedBetsDates)).sort();
    let obj = [];
    let totalDeterminedMoneyHistoric = 0;
    let totalDeterminedBenefitHistoric = 0;
    let yieldHistoric = 0;

    for (let index = 0; index < uniqueTotalDates.length; index++) {
      let totalDeterminedMoneyforDate = 0;
      let totalDeterminedBenefitforDate = 0;
      let yieldforDate = 0;
      let betsOfDate = new Array<Bet>();
      const dataRow = [new Date(uniqueTotalDates[index]), [], 0, 0];
      // console.log(new Date(uniqueTotalDates[index]));
      for (let indexIn = 0; indexIn < this.totalDeterminedBetsDates.length; indexIn++) {
        if(uniqueTotalDates[index] === this.totalDeterminedBetsDates[indexIn]){
          totalDeterminedMoneyHistoric += this.determinedBetsYield[indexIn].totalBetValue;
          betsOfDate.push(this.determinedBetsYield[indexIn]);
          totalDeterminedMoneyforDate += this.determinedBetsYield[indexIn].totalBetValue;
          if(this.determinedBetsYield[indexIn].betState === 1){
            totalDeterminedBenefitHistoric += this.determinedBetsYield[indexIn].totalBetBenefit;
            totalDeterminedBenefitforDate += this.determinedBetsYield[indexIn].totalBetBenefit;
          } else if (this.determinedBetsYield[indexIn].betState === 2){
             totalDeterminedBenefitHistoric += this.determinedBetsYield[indexIn].totalBetValue/2+this.determinedBetsYield[indexIn].totalBetValue/2*this.determinedBetsYield[indexIn].quote;
             totalDeterminedBenefitforDate += this.determinedBetsYield[indexIn].totalBetValue/2+this.determinedBetsYield[indexIn].totalBetValue/2*this.determinedBetsYield[indexIn].quote;
          } else if (this.determinedBetsYield[indexIn].betState == 0){
             totalDeterminedBenefitHistoric += this.determinedBetsYield[indexIn].totalBetValue;
             totalDeterminedBenefitforDate += this.determinedBetsYield[indexIn].totalBetValue;
          } else if(this.determinedBetsYield[indexIn].betState === -2){
             totalDeterminedBenefitHistoric += this.determinedBetsYield[indexIn].totalBetValue/2;
             totalDeterminedBenefitforDate += this.determinedBetsYield[indexIn].totalBetValue/2;
          }
        }
      }
      yieldHistoric = ((totalDeterminedBenefitHistoric/totalDeterminedMoneyHistoric)*100)-100;
      yieldHistoric = Number.parseFloat(yieldHistoric.toFixed(2));

      totalDeterminedBenefitforDate -= totalDeterminedMoneyforDate;
      yieldforDate = (totalDeterminedBenefitforDate/totalDeterminedMoneyforDate)*100;
      yieldforDate = Number.parseFloat(yieldforDate.toFixed(2));

      //console.log('DeterminedMoneyforDate ' + totalDeterminedMoneyforDate + '€');
      //console.log('DeterminedBenefitforDate ' + totalDeterminedBenefitforDate + '€');
      //console.log('YieldforDate ' + yieldforDate + '%');

      //console.log('YieldHistoric ' + yieldHistoric + '%');

      dataRow[1] = betsOfDate;
      dataRow[2] = yieldforDate;
      dataRow[3] = yieldHistoric;
      obj.push(dataRow);
    }

    // console.log(obj);

    if(obj.length > 0){
      let dataTable = [
        ['Date', 'Yield %']
      ];
      obj.forEach(element =>{ 
        let dataTableRow = [element[0], element[3]];
        dataTable.push(dataTableRow);
      });

      this.areaChartYield = {
        chartType: 'AreaChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Yield',
          height: 400,
          width: 300,
          chartArea: { height: '300' },
          legend: { position: 'none' }
        },
      };
    } else {
      const dataTable = [['Yield', {role: 'annotation', type: 'string'}], ['', 'No Data to Display']];
      this.areaChartYield = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Yield',
          height: 400,
          width: 300,
          chartArea: { height: '300' },
          legend: { position: 'none' },
          annotations: {
            // remove annotation stem and push to middle of chart
            stem: {
              color: 'transparent',
              length: 170
            },
            textStyle: {
              color: '#9E9E9E',
              fontSize: 18
            }
          }
        },
      };
    }
  }

  loadChartWinRate() {
    if (this.tipsterSelected.winRate > 0) {
      const dataTable = [['Rate', '%'], ['Win Rate', this.tipsterSelected.winRate], ['Loss Rate', this.tipsterSelected.lostRate], ['Void', this.tipsterSelected.nullRate]];
      this.pieCharWinRate = {
        chartType: 'PieChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Win Rate',
          height: 400,
          width: 300,
          pieHole: 0.4,
          chartArea: { height: '300',
                      width: '225' },
          legend: { position: 'top', alignment: 'start', maxLines: 1 , textStyle: {
            fontSize: 10.75
          } },
        },
      };
    } else {
      const dataTable = [['Rate', {role: 'annotation', type: 'string'}], ['', 'No Data to Display']];
      this.pieCharWinRate = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Win Rate',
          height: 400,
          width: 300,
          pieHole: 0.4,
          chartArea: { height: '300',
                      width: '225' },
          annotations: {
            // remove annotation stem and push to middle of chart
            stem: {
              color: 'transparent',
              length: 170
            },
            textStyle: {
              color: '#9E9E9E',
              fontSize: 18
            }
          },
          legend: { position: 'top', alignment: 'start', maxLines: 1 , textStyle: {
            fontSize: 10.75
          } },
        },
      };
    }
  }

  loadChartProfit() {
    const dataTable = new Array<any>();
    let setOfDataTable = ['Tipster', 'Revenue', 'Invested', 'Profit'];
    let setOfDataTable2 = [this.tipsterSelected.name, (this.tipsterSelected.totalDeterminedMoney+this.tipsterSelected.totalDeterminedBenefit), this.tipsterSelected.totalDeterminedMoney, this.tipsterSelected.totalDeterminedBenefit];
    dataTable.push(setOfDataTable);
    dataTable.push(setOfDataTable2);
    if(this.tipsterSelected.totalDeterminedMoney !== 0){
      this.columnChartProfit = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Profit: ' + this.tipsterSelected.totalDeterminedBenefit + ' ' + this.tipsterSelected.currency,
          height: 400,
          width: 300,
          chartArea: { height: '300',
                       width: '225' },
          annotations: {
            // remove annotation stem and push to middle of chart
            stem: {
              color: 'transparent',
              length: 170
            },
            textStyle: {
              color: '#9E9E9E',
              fontSize: 18
            }
          },
          legend: { position: 'top', alignment: 'start', maxLines: 1 , textStyle: {
            fontSize: 10.75
          } },
          hAxis: { textPosition: 'none' }
        },
      };
    } else {
      dataTable.length = 0;
      let setOfDataTable = ['Tipster', {role: 'annotation', type: 'string'}];
      let setOfDataTable2 = ['', 'No Data to Display'];
      dataTable.push(setOfDataTable);
      dataTable.push(setOfDataTable2);
      this.columnChartProfit = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Profit: ' + this.tipsterSelected.totalDeterminedBenefit + ' ' + this.tipsterSelected.currency,
          height: 400,
          width: 300,
          chartArea: { height: '300',
                       width: '225' },
          annotations: {
          // remove annotation stem and push to middle of chart
          stem: {
            color: 'transparent',
            length: 170
          },
            textStyle: {
              color: '#9E9E9E',
              fontSize: 18
            }
          },
          legend: { position: 'top', alignment: 'start', maxLines: 1 , textStyle: {
            fontSize: 10.75
          } },
          hAxis: { textPosition: 'none' }
        },
      };
    }
    
  }

  selectSport(event: any){
    this.sportSearchWord = event.sport;
  }

  onChangeSearch(event: any){
    this.sportSearchWord = event;
    if(this.sportSearchWord.length < 1){
      this.sportsAutocomplete.close();
    }
  }

  onInputCleared(){
    this.sportSearchWord = '';
    this.sportsAutocomplete.close();
  }

  selectBookie(event: any){
    this.bookieSearchWordCreateBet = event.bookie;
    this.bookieSearchWordCreateTipster = event.bookie;
    this.bookieSearchWord = event.bookie;
  }

  onChangeSearchBookie(event: any){
    this.bookiesAutocomplete.open();
    this.spliceTemplateBookieList();
    this.bookieSearchWord = event;
    this.bookieSearchWordCreateBet = event;
    this.bookieSearchWordCreateTipster = event;
    if(this.sportSearchWord.length < 1){
      this.bookiesAutocomplete.close();
    }
  }

  spliceTemplateBookieList(){
    setTimeout(() => { this.bookiesAutocomplete.filteredList.splice(3, this.bookiesAutocomplete.filteredList.length-3); }, 0.5);
  }

  onFocusedBookie(event: any){
    this.spliceTemplateBookieList();
    if(this.bookieSearchWord){
      if(this.bookieSearchWord.length < 1){
        this.bookiesAutocomplete.close();
      }
    }
  }

  onInputClearedBookie(){
    this.bookieSearchWord = '';
    this.bookieSearchWordCreateBet = '';
    this.bookieSearchWordCreateTipster = '';
    this.bookiesAutocomplete.close();
  }

  autocompleteBookieInputClick(){
    this.spliceTemplateBookieList();
  }

  editBet(){
    this.betSelected.sport = this.sportSearchWord;
    this.betSelected.stakeLevel = this.validatorFormCreateBet.get('betStake').value;
    this.betSelected.quote = this.validatorFormCreateBet.get('betOdds').value;
    this.betSelected.description = this.validatorFormCreateBet.get('betDescription').value;
    this.betSelected.bookie = this.bookieSearchWord;
    this.betSelected.preLive = this.validatorFormCreateBet.get('betPreLive').value;
    this.betSelected.totalBetValue = Number.parseFloat((this.betSelected.betValuePerUnit*this.betSelected.stakeLevel).toFixed(2));
    this.betSelected.totalBetBenefit = Number.parseFloat((this.betSelected.quote*this.betSelected.totalBetValue).toFixed(2));
    this.betSelected.profitUnits = Number.parseFloat(((this.betSelected.totalBetBenefit/this.betSelected.betValuePerUnit)-(this.betSelected.totalBetValue/this.betSelected.betValuePerUnit)).toFixed(2));
    this.totalSports.forEach(element => {
      if(element.sport === this.sportSearchWord){
        this.betSelected.srcIcon = element.src;
      }
    });
    this.tipsterService.editBet(this.tipsterSelected, this.betSelected, this.oldtotalBetValue, this.oldTotalBetBenefit);
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters);
    this.alertService.presentToast('Bet Edited', 1000, 'error');
    this.closeModal();
  }

  createBet(){
    let betToCreate = new Bet(this.validatorFormCreateBet.get('betStake').value, this.validatorFormCreateBet.get('betOdds').value, this.validatorFormCreateBet.get('betDescription').value,  this.sportSearchWord, this.tipsterSelected.valuePerUnit, this.bookieSearchWordCreateBet, this.validatorFormCreateBet.get('betPreLive').value);
    this.tipsterSelected.lastBookiePlayed = this.bookieSearchWordCreateBet;
    this.tipsterSelected.lastPreLivePlayed = this.validatorFormCreateBet.get('betPreLive').value;
    this.totalSports.forEach(element => {
      if(element.sport === this.sportSearchWord){
        betToCreate.srcIcon = element.src;
      }
    });
    this.tipsterService.addBet(this.tipsterSelected, betToCreate);
    this.betService.addToTotalActiveBets(this.totalActiveBets, betToCreate);
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters);
    this.alertService.presentToast('Bet Created', 1000, 'error');
    this.closeModal();
  }

  createTipster(){
    let tipsterToCreate = new Tipster(this.validatorFormCreateTipster.get('tipsterName').value, this.validatorFormCreateTipster.get('tipsterBank').value, this.validatorFormCreateTipster.get('tipsterValuePerUnit').value, this.validatorFormCreateTipster.get('tipsterCurrency').value, this.bookieSearchWordCreateTipster);
    //console.log(this.apiService.getTipster(123));
    this.tipsterService.addToList(this.totalTipsters, tipsterToCreate);
    this.storageService.save(this.totalTipsters);
    this.alertService.presentToast('Tipster Created', 1000, 'error');
  }

  editTipster(){
    this.tipsterSelected.name = this.validatorFormEditTipster.get('tipsterName').value;
    this.tipsterSelected.totalBank = this.validatorFormEditTipster.get('tipsterBank').value;
    this.tipsterSelected.valuePerUnit = this.validatorFormEditTipster.get('tipsterValuePerUnit').value;
    this.tipsterSelected.currency = this.validatorFormEditTipster.get('tipsterCurrency').value;
    this.tipsterSelected.lastBookiePlayed = this.bookieSearchWordCreateTipster;
    this.tipsterService.replaceTipsterFromList(this.totalTipsters, this.tipsterSelected);
    this.storageService.save(this.totalTipsters);
    this.alertService.presentToast('Tipster Saved', 1000, 'error');
  }
}
