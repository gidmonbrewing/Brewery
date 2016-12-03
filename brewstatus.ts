"use strict";
/**
 * Brewstatus
 */
class Brewstatus {
    private _hltUt : number;
    public get HltUt() : number {
        return this._hltUt;
    }
    
    private _mskUt : number;
    public get MskUt() : number {
        return this._mskUt;
    }
    
    private _mskIn : number;
    public get MskIn() : number {
        return this._mskIn;
    }
    
    private _mashTimeLeft : number;
    public get MashTimeLeft() : number {
        return this._mashTimeLeft;
    }
    
    private _targetTemperature : number;
    public get TargetTemperature() : number {
        return this._targetTemperature;
    }
    
    constructor(hltUt: number, mskUt: number, mskIn: number, mashTimeLeft: number, targetTemperature: number) {
       this._hltUt = hltUt;
       this._mskUt = mskUt;
       this._mskIn = mskIn;
       this._mashTimeLeft = mashTimeLeft;
       this._targetTemperature = targetTemperature;
    }
}
export = Brewstatus;