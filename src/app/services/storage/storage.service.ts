import { Injectable } from '@angular/core';
import { Tipster } from 'src/app/shared/tipster';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  createIfNotExists(totalTipsters: Array<Tipster>): Array<Tipster>{
    totalTipsters = new Array<Tipster>();
    //totalTipsters.push(new Tipster('Antonio', 1000, 10, 'E'));
    //totalTipsters[0].tipsterBets.push(new Bet(2, 1.5,'description1', 'football'));
    //totalTipsters[0].tipsterBets.push(new Bet(2, 2,'description2', 'basketball'));
    //totalTipsters.push(new Tipster('Lucas', 200, 20, '$'));
    if (localStorage.getItem("totalTipsters") === null) {
      this.save(totalTipsters);
      return totalTipsters;
    } else {
      return this.load()
    }
  }
  
  save(totalTipsters: Array<Tipster>){
    localStorage.setItem("totalTipsters", JSON.stringify(totalTipsters));
  }

  load(): Array<Tipster>{
    return JSON.parse(localStorage.getItem("totalTipsters"));
  }
}
