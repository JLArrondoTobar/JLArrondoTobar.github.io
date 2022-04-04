import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MiscDataService {

  totalSports: Array<string> = ['American Football',
                                'Baseball',
                                'Basketball',
                                'Bowls',
                                'Boxing/MMA',
                                'Cricket',
                                'Cyling',
                                'Darts',
                                'eSports',
                                'Football',
                                'Gaelic Sports',
                                'Golf',
                                'Greyhound',
                                'Horse Racing',
                                'Ice Hockey',
                                'Formula 1',
                                'Nascar',
                                'Rugby',
                                'Snooker',
                                'Tennis',
                                'Volleyball'
                               ];

  
  constructor() { }

  getSports(): Array<String>{
    return this.totalSports;
  };
}
