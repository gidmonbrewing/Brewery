"use strict"
/*
 * Sparge
 */
class Sparge {
    private _time: number;
    private _startTime: number;
    private _temperature: number;
    private _tolerance: number;
    private _isInPrePhase: boolean;
    public get IsInPrePhase() : boolean {
        return this._isInPrePhase;
    }
    private _isRunning: boolean;
    public get IsRunning() : boolean {
        return this._isRunning;
    }

    constructor(time: number, temperature: number) {
        this._tolerance = 0.5;
        this._temperature = temperature;
        this._time = time;
    }

    public StartPrePhase() {
        this._isInPrePhase = true;
    }

    public Start() {
        this._isInPrePhase = false;
        this._isRunning = true;
        this._startTime = Date.now();
    }

    public CheckStatus()
    {
        if(Date.now() - this._startTime > this._time)
            this._isRunning = false;
    }

    public HeatOn(hltUt: number) {
        if(hltUt + this._tolerance > this._temperature)
            return false;
        else
            return true;
    }
}

export = Sparge;