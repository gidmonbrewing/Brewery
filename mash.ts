"use strict";
/**
 * Mash
 */
class Mash {
    
    private _tolerance: number;
    private _heatTolerance: number;
    private _isMashing: boolean;
    public get IsMashing() : boolean {
        return this._isMashing;
    }

    private _StartTime : number;
    public get StartTime() : number {
        return this._StartTime;
    }
    public set StartTime(v : number) {
        this._StartTime = v;
    }
    
    private _MashTime : number;
    public get MashTime() : number {
        return this._MashTime;
    }
    public set MashTime(v : number) {
        this._MashTime = v;
    }
    
    private _MashTemp : number;
    public get MashTemp() : number {
        return this._MashTemp;
    }
    public set MashTemp(v : number) {
        this._MashTemp = v;
    }

    constructor(mashTime: number, mashTemp: number) {
        this._tolerance = 0.2;
        this._heatTolerance = 1.63;
        this.MashTemp = mashTemp;
        this.MashTime = mashTime * 60000;
        this._StartTime = -1;
        this._isMashing = false;
    }

    public ResetHeatTolerance() {
        this._heatTolerance = 1.63;
    }
    
    public HeatOn(hltUt: number, mskUt: number, mskIn: number) {
        if(this.IsDone())
        {
            console.log('Mashing is done');
            this._isMashing = false;
        }
        if(mskUt > this.MashTemp - this._tolerance && mskIn > this.MashTemp - this._tolerance) {
            if(this._isMashing)
            {
                this._heatTolerance = 0;
            }
            return false;    
        }
        console.log('hltUt:' + hltUt + ' compare: ' + (this.MashTemp + Math.min((this.MashTemp - mskUt), Math.abs(mskIn - mskUt)) + this._heatTolerance));
        if(hltUt > (this.MashTemp + Math.min((this.MashTemp - mskUt), Math.abs(mskIn - mskUt)) + this._heatTolerance))
            return false;
                    
        return true;
    }
    
    public IsDone() {
        return Date.now() - this.StartTime >= this.MashTime;
    }
    
    public TimeLeft() {
        console.log('time left')
        if(this._isMashing)
            return this.MashTime - (Date.now() - this.StartTime);
        else
            return 0;
    }

    public StartMash(){
        console.log('Start mashing');
        this._isMashing = true;
        this.StartTime = Date.now();
    }
}

export = Mash;