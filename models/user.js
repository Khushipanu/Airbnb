const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true

    }
    
})
userSchema.plugin(passportLocalMongoose); 
//ye plugin user schema mai username plus passsword fields automaticallly add kr deta hai
module.exports=mongoose.model('User',userSchema)