import { Bet } from './bet';
import * as uuid from 'uuid';

export class Tipster {
    uuidValue: string;
    name: string;
    totalBank: number;
    valuePerUnit: number;
    totalMoneyBet: number;
    possibleWinnings: number;
    tipsterBets: Array<Bet>;
    totalLostBets: Array<Bet>;
    totalNullBets: Array<Bet>;
    totalWonBets: Array<Bet>;
    totalHalfLostBets: Array<Bet>;
    totalHalfWonBets: Array<Bet>;
    profitUnits: number;
    averageStake: number;
    averageOdds: number;
    totalDeterminedMoney: number;
    totalDeterminedBenefit: number;
    yield: number;
    currency: string;
    numberOfWonPicks: number;
    numberOfLostPicks: number;
    winRate: number;
    lostRate: number;
    nullRate: number;
    picksInPlay: number;
    totalUnitsPlayed: number;
    lastBookiePlayed: string;
    lastPreLivePlayed: string;

    determinedBetsOrderList = [1, -1, 0, 2, -2];

    determinedNewBets: number;

    numberOfNullPicks: number;
    hasFilterActivated: boolean;
    filterDatesRange: Array<Date>;

    constructor(newName: string, newTotalBank: number, newValuePerUnit: number, newCurrency: string,
                lastBookiePlayed?: string){
        this.uuidValue = uuid.v4();
        this.name = newName;
        this.totalBank = newTotalBank;
        this.valuePerUnit = newValuePerUnit;
        this.totalMoneyBet = 0;
        this.possibleWinnings = 0;
        this.tipsterBets = new Array<Bet>();
        this.totalLostBets = new Array<Bet>();
        this.totalNullBets = new Array<Bet>();
        this.totalWonBets = new Array<Bet>();
        this.totalHalfLostBets = new Array<Bet>();
        this.totalHalfWonBets = new Array<Bet>();
        this.profitUnits = 0;
        this.averageStake = 0;
        this.averageOdds = 0;
        this.totalDeterminedMoney = 0;
        this.totalDeterminedBenefit = 0;
        this.yield = 0;
        this.totalUnitsPlayed = 0;
        this.winRate = 0;
        this.numberOfWonPicks = 0;
        this.currency = newCurrency;
        this.numberOfLostPicks = 0;
        this.lostRate = 0;
        this.nullRate = 0;
        this.picksInPlay = 0;
        this.lastBookiePlayed = lastBookiePlayed;
        this.determinedNewBets = 0;
        this.numberOfNullPicks = 0;
        this.hasFilterActivated = false;
        this.filterDatesRange = new Array<Date>();
    }

}
