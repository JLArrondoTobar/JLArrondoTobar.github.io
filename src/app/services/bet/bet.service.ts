import { Injectable } from '@angular/core';
import { Bet } from 'src/app/shared/bet';

@Injectable({
  providedIn: 'root'
})
export class BetService {

  constructor() { }

  addToTotalActiveBets(totalActiveBets: Array<Bet>, bet: Bet){
    totalActiveBets.push(bet);
  }

  removeFromActiveBets(totalActiveBets: Array<Bet>, bet: Bet){
    for (let index = 0; index < totalActiveBets.length; index++) {
      if(totalActiveBets[index].uuidValue === bet.uuidValue){
        totalActiveBets.splice(index, 1);
      }      
    }
  }

  replaceBetInActiveBets(totalActiveBets: Array<Bet>, bet: Bet){
    for (let index = 0; index < totalActiveBets.length; index++) {
      if(totalActiveBets[index].uuidValue === bet.uuidValue){
        totalActiveBets[index] = bet;
      }      
    }
  }

  removeFromDeterminedBets(totalDeterminedBets: Array<Bet>, bet: Bet){
    for (let index = 0; index < totalDeterminedBets.length; index++) {
      if(totalDeterminedBets[index].uuidValue === bet.uuidValue){
        totalDeterminedBets.splice(index, 1);
      }      
    }
  }

}
