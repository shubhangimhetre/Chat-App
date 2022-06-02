const mongoose=require('mongoose')

var userSchema2 = mongoose.Schema({
    message_from: { type: String, trim: true, required: true,max:70 },
    message: { type:String},
    // user_id:{ type:String, unique:true, ref:'users'}

},{timestamps:true});

module.exports=mongoose.model('messages',userSchema2)