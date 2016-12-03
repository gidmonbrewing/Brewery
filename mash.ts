"use strict";
/**
 * Mash
 */
class Mash {
    
    private _tolerance: number;
    private _heatTolerance: number;

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

    
    private _IsMashing : boolean;
    public get IsMashing() : boolean {
        return this._IsMashing;
    }
    public set IsMashing(v : boolean) {
        this._IsMashing = v;
    }
    
    constructor(mashTime: number, mashTemp: number) {
        this._tolerance = 0.2;
        this._heatTolerance = 1.63;
        this.MashTemp = mashTemp;
        this.MashTime = mashTime * 60000;
        this._StartTime = -1;
        this._IsMashing = false;
    }

    public ResetHeatTolerance() {
        this._heatTolerance = 1.63;
    }
    
    public HeatOn(hltUt: number, mskUt: number, mskIn: number) {
        if(mskUt > this.MashTemp - this._tolerance && mskIn > this.MashTemp - this._tolerance) {
            if(this._IsMashing)
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
        if(this._IsMashing)
            return (Date.now() - this.StartTime) - this.MashTime;
        else
            return 0;
    }

    public StartMash(){
        this._IsMashing = true;
        this.StartTime = Date.now();
    }
}

export = Mash;