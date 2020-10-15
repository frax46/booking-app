const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event:{
        type:Schema.Types.ObjectId,
        ref: 'Event'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})
// the second argument of the schema is to add options

module.exports = mongoose.model('Booking',bookingSchema)