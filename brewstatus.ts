"use strict";
/**
 * Brewstatus
 */
class Brewstatus {
    private _hltUt : number;
    public get hltUt() : number {
        return this._hltUt;
    }
    public set hltUt(v : number) {
        this._hltUt = v;
    }
    
    private _mskUt : number;
    public get mskUt() : number {
        return this._mskUt;
    }
    public set mskUt(v : number) {
        this._mskUt = v;
    }
    
    private _mskIn : number;
    public get mskIn() : number {
        return this._mskIn;
    }
    public set mskIn(v : number) {
        this._mskIn = v;
    }
    
    private _timeLeft : number;
    public get timeLeft() : number {
        return this._timeLeft;
    }
    public set timeLeft(v : number) {
        this._timeLeft = v;
    }
    
    private _targetTemperature : number;
    public get targetTemperature() : number {
        return this._targetTemperature;
    }
    public set targetTemperature(v : number) {
        this._targetTemperature = v;
    }
    
    constructor(hltUt: number, mskUt: number, mskIn: number, timeLeft: number, targetTemperature: number) {
       this._hltUt = hltUt;
       this._mskUt = mskUt;
       this.mskIn = mskIn;
       this.timeLeft = timeLeft;
       this.targetTemperature = targetTemperature;
    }
}
export = Brewstatus;