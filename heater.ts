"use strict";
var gpio = require('pi-gpio');
/**
 * Heater
 */
const IOPORT = 22;
class Heater {

    private _Status : boolean;
    public get Status() : boolean {
        return this._Status;
    }
    public set Status(v : boolean) {
        this._Status = v;
    }
    
    constructor() {
        gpio.close(IOPORT, function(er){
            console.log("close");
            console.log(er);

            gpio.open(IOPORT, "output", function(err){
                console.log("open");
                console.log(err);
            });
        });
        this.Status = false;
    }
    
    On(){
        var that = this;
        gpio.write(IOPORT, false, function(err){
            if(err)
                console.log(err);
            else
                that.Status = true;
       });
    }
       
    Off(){
        var that = this;
        gpio.write(IOPORT, true, function(err){
            if(err)
                console.log(err);
            else
                that.Status = true;
       });
    }
}

export = Heater;
