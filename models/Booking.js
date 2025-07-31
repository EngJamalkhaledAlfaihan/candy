const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,//ليس حقل اجباري لانه ممكن ان يكون ضيفا لا يوجد حساب
},
serviceId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
},
date:{
    type: Date,
    required: true,
},
time:{
    type: String,
    required: true,
},
status:{
    type : String,
    enum :["pending","confirmed","completed","cancelled"],
    default: "pending",
},
createdAt:{
    type: Date,
    default: Date.now,
},
notes:
{
    type:String,
}



});
module.exports = mongoose.model("Booking",bookingSchema);