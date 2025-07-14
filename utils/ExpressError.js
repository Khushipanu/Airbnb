class ExpressError extends Error{
    constructor(status){  //constructor() ek special function hota hai jo tab chalta hai jab hum class ka object banate hain.
        super();
        this.status=status,
        this.message=message;

    }
}
module.exports=ExpressError;