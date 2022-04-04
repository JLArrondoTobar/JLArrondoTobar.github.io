import { Component, ViewChild, OnInit } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { Tipster } from '../shared/tipster';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { Bet } from '../shared/bet';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  public columnChartProfitUnits: GoogleChartInterface;
  public pieChartWinRate: GoogleChartInterface;
  public columnChartProfitCurrency: GoogleChartInterface;
  public areaChartYield: GoogleChartInterface;
  public barChart: GoogleChartInterface;
  totalTipsters: Array<Tipster>;
  array1: any[];

  totalProfit: number;
  totalDeteterminedBenefit: number;
  totalDeterminedMoney: number;
  totalWonPicks: number;
  totalWinRate: number;
  totaLossRate: number;
  winRateGlobal: number;
  lossRateGlobal: number;
  totalTipstersForRates: number;
  totalNullRate: number;
  totalNullGlobal: number;
  totalDeterminedBetsDates: Array<number>;
  determinedBetsYield: Array<Bet>;

  constructor(private storageService: StorageService) {   }

  ngOnInit(): void {  }

  ionViewDidEnter() {
    this.totalDeterminedBetsDates = new Array<number>();
    this.determinedBetsYield = new Array<Bet>();
    this.totalDeteterminedBenefit = 0;
    this.totalDeterminedMoney = 0;
    this.totalWonPicks = 0;
    this.totalWinRate = 0;
    this.totaLossRate = 0;
    this.totalTipstersForRates =0;

    this.totalProfit = 0;
    this.totalTipsters = this.storageService.load();
    this.totalTipsters.forEach(tipster => {
      this.totalProfit += tipster.profitUnits;
      this.totalDeteterminedBenefit += tipster.totalDeterminedBenefit;
      this.totalWonPicks += tipster.numberOfWonPicks;
      this.totalDeterminedMoney += tipster.totalDeterminedMoney;
      if(tipster.totalDeterminedMoney>0){
        this.totalTipstersForRates +=1;
      this.totalWinRate += tipster.winRate;
      this.totaLossRate += tipster.lostRate;
      }
    });
    this.totaLossRate = this.totaLossRate/this.totalTipstersForRates;
    this.totalWinRate = this.totalWinRate/this.totalTipstersForRates;
    this.totalNullRate = 100-this.totalWinRate-this.totaLossRate;

    this.totalProfit = Number.parseFloat((this.totalProfit).toFixed(2));
    this.totalDeterminedMoney = Number.parseFloat((this.totalDeterminedMoney).toFixed(2));
    this.totalDeteterminedBenefit = Number.parseFloat((this.totalDeteterminedBenefit).toFixed(2));


    this.loadColumnChartProfitUnits();
    this.loadPieChartWinRate();
    this.loadColumnChartProfitCurrency();
    this.loadAreChartYield();
  }

  loadAreChartYield() {
    this.totalTipsters.forEach(tipsterSelected => {
      tipsterSelected.totalLostBets.forEach(bet => {
        this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
        this.determinedBetsYield.push(bet);
      });
      tipsterSelected.totalHalfLostBets.forEach(bet => {
        this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
        this.determinedBetsYield.push(bet);
      });
      tipsterSelected.totalNullBets.forEach(bet => {
        this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
        this.determinedBetsYield.push(bet);
      });
      tipsterSelected.totalHalfWonBets.forEach(bet => {
        this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
        this.determinedBetsYield.push(bet);
      });
      tipsterSelected.totalWonBets.forEach(bet => {
        this.totalDeterminedBetsDates.push(new Date(bet.betDate).getTime());
        this.determinedBetsYield.push(bet);
      });
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

      // console.log('DeterminedMoneyforDate ' + totalDeterminedMoneyforDate + '€');
      // console.log('DeterminedBenefitforDate ' + totalDeterminedBenefitforDate + '€');
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
          title: 'Overall Yield',
          height: 450,
          width: 350,
          chartArea: { height: '350',
                        width: '262.5' },
          legend: { position: 'none' }
        }
      }
    } else {
      const dataTable = [['Yield', {role: 'annotation', type: 'string'}], ['', 'No Data to Display']];
      this.areaChartYield = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Yield',
          height: 450,
          width: 350,
          pieHole: 0.4,
          chartArea: { height: '350',
                      width: '262.5' },
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
          legend: { position: 'top', alignment: 'start' }
        },
      };
    }

  }

  loadColumnChartProfitUnits() {
    const dataTable = new Array<any>();
    let setOfNamesDataTable = new Array<string>();
    let setOfProfitsDataTable = new Array<any>();
    setOfNamesDataTable = ['Tipster'];
    setOfProfitsDataTable = ['Profit'];
    this.totalTipsters.forEach(element => {
      if(element.totalDeterminedMoney >0){
        setOfNamesDataTable.push(element.name);
        setOfProfitsDataTable.push(element.profitUnits);
      }
    });
    if(setOfProfitsDataTable.length > 1){
      dataTable.push(setOfNamesDataTable);
      dataTable.push(setOfProfitsDataTable);
      this.columnChartProfitUnits = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Profit Units: ' + this.totalProfit + ' u.',
          height: 450,
          width: 350,
          chartArea: { height: '350',
                      width: '262.5' },
          legend: { position: 'top', alignment: 'start', maxLines: 1 }
        },
      };
    } else {
      const dataTable = [['Profit', {role: 'annotation', type: 'string'}], ['', 'No Data to Display']];
      this.columnChartProfitUnits = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Profit Units: ' + this.totalProfit + ' u.',
          height: 450,
          width: 350,
          chartArea: { height: '350',
                      width: '262.5' },
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
          legend: { position: 'top', alignment: 'start', maxLines: 1 }
        },
      };
    }
  }

  loadPieChartWinRate() {
    if (this.totalWinRate > 0 ) {
      const dataTable = [['Rate', '%'], ['WinRate', this.totalWinRate], ['LossRate', this.totaLossRate], ['Void', (this.totalNullRate)]];
      this.pieChartWinRate = {
        chartType: 'PieChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Win Rate',
          height: 450,
          width: 350,
          pieHole: 0.4,
          chartArea: { height: '350',
                      width: '262.5' },
          legend: { position: 'top', alignment: 'start' }
        },
      };
    } else {
      const dataTable = [['Yield', {role: 'annotation', type: 'string'}], ['', 'No Data to Display']];
      this.pieChartWinRate = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Win Rate',
          height: 450,
          width: 350,
          pieHole: 0.4,
          chartArea: { height: '350',
                      width: '262.5' },
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
          legend: { position: 'top', alignment: 'start' }
        },
      };
    }
  }

  loadColumnChartProfitCurrency() {
    const dataTable = new Array<any>();
    let setOfDataTable = ['Tipster', 'Revenue', 'Invested', 'Benefit'];
    dataTable.push(setOfDataTable);
    this.totalTipsters.forEach(element => {
      if(element.totalDeterminedMoney > 0){
        let setOfDatabTable = [element.name, (element.totalDeterminedMoney+element.totalDeterminedBenefit), element.totalDeterminedMoney, (element.totalDeterminedMoney+element.totalDeterminedBenefit-element.totalDeterminedMoney)];
        dataTable.push(setOfDatabTable);
      }
    });
    if (dataTable.length > 1) {
      this.columnChartProfitCurrency = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Money Profit: ' + this.totalDeteterminedBenefit + 'E',
          height: 450,
          width: 350,
          chartArea: { height: '350',
                      width: '262.5' },
          legend: { position: 'top', alignment: 'start', maxLines: 1 },
          explorer: {
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          },
          hAxis: { titleTextStyle: {color: '#333'},
                    slantedText:true, slantedTextAngle:25},
            vAxis: {minValue: 0},
        },
      };
    } else {
      //const dataTable = [['Rate', '%'], ['', this.totalWinRate], ['', this.totaLossRate], ['', (this.totalNullRate)]];
      const dataTable = [['Tipster', {role: 'annotation', type: 'string'}], ['', 'No Data to Display']];
      this.columnChartProfitCurrency = {
        chartType: 'ColumnChart',
        dataTable: dataTable,
        //opt_firstRowIsData: true,
        options: {
          title: 'Overall Money Profit: ' + this.totalDeteterminedBenefit + 'E',
          height: 450,
          width: 350,
          chartArea: { height: '350',
                      width: '262.5' },
          legend: { position: 'top', alignment: 'start', maxLines: 1 },
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
          /*explorer: {
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          },*/
          hAxis: { titleTextStyle: {color: '#333'},
                    slantedText:true, slantedTextAngle:25},
            vAxis: {minValue: 0},
        },
      };
    }
  }
}