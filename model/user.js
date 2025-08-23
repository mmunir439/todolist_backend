const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    cnic:{type:String,required:true},
    password:{type:String,required:true},
})
module.exports=mongoose.model('User', userSchema);