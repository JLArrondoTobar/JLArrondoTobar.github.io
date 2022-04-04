import { Injectable } from '@angular/core';
import { Tipster } from 'src/app/shared/tipster';
import { Bet } from 'src/app/shared/bet';

@Injectable({
  providedIn: 'root'
})
export class TipsterService {

  constructor() { }

  addToList(totalTipsters: Array<Tipster>, tipster: Tipster){
    totalTipsters.push(tipster);
  }

  removeFromList(totalTipsters: Array<Tipster>, index: number){
    totalTipsters.splice(index, 1); 
  }

  replaceTipsterFromList(totalTipsters: Array<Tipster>, tipster: Tipster){
    for (let index = 0; index < totalTipsters.length; index++) {
      if(totalTipsters[index].uuidValue === tipster.uuidValue){
        totalTipsters[index] = tipster;
      }
    }
  }

  addBet(tipster: Tipster, bet: Bet){
    tipster.totalBank = Number.parseFloat((tipster.totalBank - bet.totalBetValue).toFixed(2));
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet + bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings + bet.totalBetBenefit).toFixed(2));
    tipster.tipsterBets.push(bet);
    this.calculateAverages(tipster);
  }

  calculateAverages(tipster: Tipster){
    tipster.averageStake = 0;
    tipster.averageOdds = 0;
    let totalOdds = 0;
    let totalBets = 0;
    let totalAverage = 0;
    tipster.tipsterBets.forEach(bet => {
      totalBets =  totalBets + 1;
      totalOdds = totalOdds + bet.quote;
      totalAverage = totalAverage  + bet.stakeLevel;
    });
    if(tipster.totalWonBets.length > 0){
      tipster.totalWonBets.forEach(bet => {
        totalBets =  totalBets + 1;
        totalOdds = totalOdds + bet.quote;
        totalAverage = totalAverage  + bet.stakeLevel;
      });
    }
    if(tipster.totalLostBets.length > 0){
      tipster.totalLostBets.forEach(bet => {
        totalBets =  totalBets + 1;
        totalOdds = totalOdds + bet.quote;
        totalAverage = totalAverage  + bet.stakeLevel;
      });
    }
    if(tipster.totalNullBets.length > 0){
      tipster.totalNullBets.forEach(bet => {
        totalBets =  totalBets + 1;
        totalOdds = totalOdds + bet.quote;
        totalAverage = totalAverage  + bet.stakeLevel;
      });
    }
    tipster.averageOdds = Number.parseFloat((totalOdds / totalBets).toFixed(2));
    tipster.averageStake = Number.parseFloat((totalAverage / totalBets).toFixed(2));
  }

  deleteBet(tipster: Tipster, bet: Bet){
    tipster.totalBank = Number.parseFloat((tipster.totalBank + bet.totalBetValue).toFixed(2));
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet  - bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings - bet.totalBetBenefit).toFixed(2));
    for (let index = 0; index < tipster.tipsterBets.length; index++) {
      if(tipster.tipsterBets[index].uuidValue === bet.uuidValue){
        tipster.tipsterBets.splice(index, 1);
      }
    }
    this.calculateAverages(tipster);
  }

  editBet(tipster: Tipster, bet: Bet, oldtotalBetValue: number, oldTotalBetBenefit: number){
    tipster.totalBank = Number.parseFloat((tipster.totalBank + oldtotalBetValue - bet.totalBetValue).toFixed(2));
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet - oldtotalBetValue + bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings - oldTotalBetBenefit + bet.totalBetBenefit).toFixed(2));
    for (let index = 0; index < tipster.tipsterBets.length; index++) {
      if(tipster.tipsterBets[index].uuidValue === bet.uuidValue){
        tipster.tipsterBets[index] = bet;
      }
    }
  }

  addToTotalWonBets(tipster: Tipster, bet: Bet){
    tipster.totalBank = Number.parseFloat((tipster.totalBank + bet.totalBetBenefit).toFixed(2));
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet - bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings - bet.totalBetBenefit).toFixed(2));
    tipster.profitUnits = Number.parseFloat((tipster.profitUnits + bet.profitUnits).toFixed(2));
    tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney + bet.totalBetValue).toFixed(2));
    tipster.totalDeterminedBenefit = Number.parseFloat((tipster.totalDeterminedBenefit + (bet.totalBetBenefit-bet.totalBetValue)).toFixed(2));
    tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
    tipster.numberOfWonPicks += 1;
    tipster.determinedNewBets += 1;
    tipster.totalWonBets.push(bet);
    this.calculateWinRate(tipster);
    this.calculateLostate(tipster);
    this.calculateNullRate(tipster);
  }

  removeFromToTotalWonBets(tipster: Tipster, bet: Bet){
    for (let index = 0; index < tipster.totalWonBets.length; index++) {
       if(tipster.totalWonBets[index].uuidValue === bet.uuidValue){
          tipster.totalWonBets.splice(index, 1);
       }
    }
  }

  addToTotalNullBets(tipster: Tipster, bet: Bet){
    tipster.totalBank = Number.parseFloat((tipster.totalBank + bet.totalBetValue).toFixed(2));
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet - bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings - bet.totalBetBenefit).toFixed(2));
    tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney + bet.totalBetValue).toFixed(2));
    tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
    tipster.determinedNewBets += 1;
    tipster.numberOfNullPicks += 1;
    tipster.totalNullBets.push(bet);
    this.calculateWinRate(tipster);
    this.calculateLostate(tipster);
    this.calculateNullRate(tipster);
  }

  removeFromToTotalNullBets(tipster: Tipster, bet: Bet){
    for (let index = 0; index < tipster.totalNullBets.length; index++) {
       if(tipster.totalNullBets[index].uuidValue === bet.uuidValue){
          tipster.totalNullBets.splice(index, 1);
       }
    }
  }

  addToTotalLostBets(tipster: Tipster, bet: Bet){
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet - bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings - bet.totalBetBenefit).toFixed(2));
    tipster.profitUnits = Number.parseFloat((tipster.profitUnits - (bet.totalBetValue/bet.betValuePerUnit)).toFixed(2));
    tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney + bet.totalBetValue).toFixed(2));
    tipster.totalDeterminedBenefit = Number.parseFloat((tipster.totalDeterminedBenefit - bet.totalBetValue).toFixed(2));
    tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
    tipster.numberOfLostPicks += 1;
    tipster.determinedNewBets += 1;
    tipster.totalLostBets.push(bet);
    this.calculateWinRate(tipster);
    this.calculateLostate(tipster);
    this.calculateNullRate(tipster);
  }

  removeFromTotalLostBets(tipster: Tipster, bet: Bet){
    for (let index = 0; index < tipster.totalLostBets.length; index++) {
       if(tipster.totalLostBets[index].uuidValue === bet.uuidValue){
          tipster.totalLostBets.splice(index, 1);
       }
    }
  }

  addToTotalHalfLostBets(tipster: Tipster, bet: Bet){
    tipster.totalBank = Number.parseFloat((tipster.totalBank + (bet.totalBetValue/2)).toFixed(2));
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet - bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings - bet.totalBetBenefit).toFixed(2));
    tipster.profitUnits = Number.parseFloat(((tipster.profitUnits - (bet.stakeLevel/2))).toFixed(2));
    tipster.totalDeterminedBenefit = Number.parseFloat((tipster.totalDeterminedBenefit - (bet.totalBetValue/2)).toFixed(2));
    tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney + bet.totalBetValue).toFixed(2));
    tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
    tipster.numberOfLostPicks += 0.5;
    tipster.numberOfNullPicks += 0.5;
    tipster.determinedNewBets += 1;
    tipster.totalHalfLostBets.push(bet);
    this.calculateWinRate(tipster);
    this.calculateLostate(tipster);
    this.calculateNullRate(tipster);
  }

  addToTotalHalfWonBets(tipster: Tipster, bet: Bet){
    tipster.totalBank = Number.parseFloat((tipster.totalBank + (bet.totalBetValue/2) + (bet.totalBetValue/2*bet.quote)).toFixed(2));
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet - bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings - bet.totalBetBenefit).toFixed(2));
    tipster.profitUnits = Number.parseFloat((tipster.profitUnits + ((bet.stakeLevel/2)*bet.quote-(bet.stakeLevel/2))).toFixed(2));
    tipster.totalDeterminedBenefit = Number.parseFloat((tipster.totalDeterminedBenefit + ((bet.totalBetValue/2)*bet.quote)-(bet.totalBetValue/2)).toFixed(2));
    tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney + bet.totalBetValue).toFixed(2));
    tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
    tipster.numberOfWonPicks += 0.5;
    tipster.numberOfNullPicks += 0.5;
    tipster.determinedNewBets += 1;
    tipster.totalHalfWonBets.push(bet);
    this.calculateWinRate(tipster);
    this.calculateLostate(tipster);
    this.calculateNullRate(tipster);
  }
  
  removeFromTotalHalfLostBets(tipster: Tipster, bet: Bet){
    for (let index = 0; index < tipster.totalHalfLostBets.length; index++) {
      if(tipster.totalHalfLostBets[index].uuidValue === bet.uuidValue){
         tipster.totalHalfLostBets.splice(index, 1);
      }
    }
  }

  removeFromTotalHalfWonBets(tipster: Tipster, bet: Bet){
    for (let index = 0; index < tipster.totalHalfWonBets.length; index++) {
      if(tipster.totalHalfWonBets[index].uuidValue === bet.uuidValue){
         tipster.totalHalfWonBets.splice(index, 1);
      }
    }
  }

  removeFromTotalActiveBets(tipster: Tipster, bet: Bet){
    for (let index = 0; index < tipster.tipsterBets.length; index++) {
      if(tipster.tipsterBets[index].uuidValue === bet.uuidValue){
         tipster.tipsterBets.splice(index, 1);
      }
   }
  }

  returnBet(tipster: Tipster, bet: Bet){
    tipster.totalMoneyBet = Number.parseFloat((tipster.totalMoneyBet + bet.totalBetValue).toFixed(2));
    tipster.possibleWinnings = Number.parseFloat((tipster.possibleWinnings + bet.totalBetBenefit).toFixed(2));
    if(bet.betState === 1){
      tipster.totalBank = Number.parseFloat((tipster.totalBank - bet.totalBetBenefit).toFixed(2));
      tipster.profitUnits = Number.parseFloat((tipster.profitUnits - bet.profitUnits).toFixed(2));
      tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney - bet.totalBetValue).toFixed(2));
      tipster.totalDeterminedBenefit = Number.parseFloat((tipster.totalDeterminedBenefit - (bet.totalBetBenefit-bet.totalBetValue)).toFixed(2));
      tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
      tipster.numberOfWonPicks -= 1;
      this.removeFromToTotalWonBets(tipster, bet);
      tipster.tipsterBets.push(bet);
    } else if(bet.betState === 0){
      tipster.totalBank = Number.parseFloat((tipster.totalBank - bet.totalBetValue).toFixed(2));
      tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney - bet.totalBetValue).toFixed(2));
      tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
      tipster.numberOfNullPicks -= 1;
      this.removeFromToTotalNullBets(tipster, bet);
      tipster.tipsterBets.push(bet);
    } else  if(bet.betState === -1){
      this.removeFromTotalLostBets(tipster, bet);
      tipster.profitUnits = Number.parseFloat((tipster.profitUnits + (bet.totalBetValue/bet.betValuePerUnit)).toFixed(2));
      tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney - bet.totalBetValue).toFixed(2));
      tipster.totalDeterminedBenefit = Number.parseFloat((tipster.totalDeterminedBenefit + bet.totalBetValue).toFixed(2));
      tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
      tipster.numberOfLostPicks -= 1;
      tipster.tipsterBets.push(bet);
    } else if(bet.betState === -2){
      this.removeFromTotalHalfLostBets(tipster, bet);
      tipster.totalBank = Number.parseFloat((tipster.totalBank - (bet.totalBetValue/2)).toFixed(2));
      tipster.profitUnits = Number.parseFloat((tipster.profitUnits + (bet.stakeLevel/2)).toFixed(2));
      tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney - bet.totalBetValue).toFixed(2));
      tipster.totalDeterminedBenefit = Number.parseFloat((tipster.totalDeterminedBenefit + (bet.totalBetValue/2)).toFixed(2));
      tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
      tipster.numberOfLostPicks -= 0.5;
      tipster.numberOfNullPicks -= 0.5;
      tipster.tipsterBets.push(bet);
    }  else if(bet.betState === 2){
      this.removeFromTotalHalfWonBets(tipster, bet);
      tipster.totalBank = Number.parseFloat((tipster.totalBank -  ((bet.totalBetValue/2) + ((bet.totalBetValue/2)*bet.quote))).toFixed(2));
      tipster.totalDeterminedBenefit = Number.parseFloat((tipster.totalDeterminedBenefit - ((bet.totalBetValue/2*bet.quote)-(bet.totalBetValue/2))).toFixed(2));
      tipster.profitUnits = Number.parseFloat((tipster.profitUnits - (((bet.stakeLevel/2)*bet.quote)-(bet.stakeLevel/2))).toFixed(2));
      tipster.totalDeterminedMoney = Number.parseFloat((tipster.totalDeterminedMoney - bet.totalBetValue).toFixed(2));
      tipster.yield = Number.parseFloat(((tipster.totalDeterminedBenefit/tipster.totalDeterminedMoney)*100).toFixed(2));
      tipster.numberOfWonPicks -= 0.5;
      tipster.numberOfNullPicks -= 0.5;
      tipster.tipsterBets.push(bet);
    }
    if(tipster.profitUnits === 0.01 || tipster.profitUnits === -0.01){
      tipster.profitUnits = 0;
      tipster.totalDeterminedBenefit = 0;
    }

    this.calculateWinRate(tipster);
    this.calculateLostate(tipster);
    this.calculateNullRate(tipster);
  }

  replaceConfirmedBet(tipster: Tipster, bet: Bet){
    for (let index = 0; index < tipster.tipsterBets.length; index++) {
      if(tipster.tipsterBets[index].uuidValue === bet.uuidValue){
        tipster.tipsterBets[index] = bet;
      }
    }
  }

  calculateWinRate(tipster: Tipster){
    let totalDeterminedPicks = tipster.totalLostBets.length + tipster.totalHalfLostBets.length + 
                               tipster.totalNullBets.length + tipster.totalHalfWonBets.length + 
                               tipster.totalWonBets.length;
    tipster.winRate = Number.parseFloat(((tipster.numberOfWonPicks/totalDeterminedPicks)*100).toFixed(2));
  }

  calculateLostate(tipster: Tipster){
    let totalDeterminedPicks = tipster.totalLostBets.length + tipster.totalHalfLostBets.length + 
                               tipster.totalNullBets.length + tipster.totalHalfWonBets.length + 
                               tipster.totalWonBets.length;
    tipster.lostRate = Number.parseFloat(((tipster.numberOfLostPicks/totalDeterminedPicks)*100).toFixed(2));
  }

  calculateNullRate(tipster: Tipster){
    tipster.nullRate = Number.parseFloat((100 - (tipster.winRate+tipster.lostRate)).toFixed(2));
  }
}
