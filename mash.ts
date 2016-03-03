"use strict";
/**
 * Mash
 */
class Mash {
    
    private _tolerance: number;
    
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
        this.MashTemp = mashTemp;
        this.MashTime = mashTime * 60000;
        this._StartTime = -1;
    }
    
    public HeatOn(hltUt: number, mskUt: number, mskIn: number) {
        if(mskUt > this.MashTemp - this._tolerance && mskIn > this.MashTemp - this._tolerance) {
            if(this._StartTime == -1)
                this.StartTime = Date.now();
            return false;    
        }
        if(hltUt > this.MashTemp + (mskIn - mskUt))
            return false;
                    
        return true;
    }
    
    public IsDone() {
        return Date.now() - this.StartTime >= this.MashTime;
    }
    
    public TimeLeft() {
        return Date.now() - this.StartTime;
    }
}

export = Mash;