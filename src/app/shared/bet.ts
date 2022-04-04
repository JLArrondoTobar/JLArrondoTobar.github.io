import * as uuid from 'uuid';

export class Bet {

    uuidValue: string;
    stakeLevel: number;
    quote: number;
    description: string;
    totalBetValue: number;
    totalBetBenefit: number;
    isActive: boolean;
    betState: number;
    sport: string;
    profitUnits: number;
    betDate: Date;
    betValuePerUnit: number;
    bookie: string;
    preLive: string;

    srcIcon: string;
    country: string;

    constructor(stakeLevel: number, quote: number, 
                description: string, sport: string, 
                betValuePerUnit: number, bookie?: string, preLive?: string){
        this.uuidValue = uuid.v4();
        this.stakeLevel = stakeLevel;
        this.quote = quote;
        this.description = description;
        this.sport = sport;
        this.bookie = bookie;
        this.preLive = preLive;
        this.betDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        this.betDate.setHours(0, 0, 0, 0);
        this.betValuePerUnit = betValuePerUnit;
        this.totalBetValue = Number.parseFloat((this.betValuePerUnit*this.stakeLevel).toFixed(2));
        this.betState = 0;
        this.totalBetBenefit = Number.parseFloat((this.quote*this.totalBetValue).toFixed(2));
        this.profitUnits = Number.parseFloat(((this.totalBetBenefit/this.betValuePerUnit)-(this.totalBetValue/this.betValuePerUnit)).toFixed(2));
        this.isActive = true;
        this.srcIcon = '';
    }
}