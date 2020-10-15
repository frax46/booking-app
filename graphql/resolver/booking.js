const Booking = require('../../models/booking');
const Event = require('../../models/event');


const {transformBooking,transformEvent} = require('./merge');



module.exports = {
    bookings: async ()=>{
        try{
            const bookings = await Booking.find();
            return bookings.map(booking=>{
                return transformBooking(booking)
            })

        } catch(err){
            console.log(err)
        }
    },
    cancelBooking:async args =>{
        try{
            const booking = await  Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event)
            await Booking.deleteOne({_id:args.bookingId})
            return event;
        }catch(err){
            console.log(err)
        }
    },
     bookEvent: async args =>{
        const fetchedEvent = await Event.findOne({_id: args.eventId})
        const booking = new Booking({
            user:'5f8792b3c7dc9749b0ae504f',
            event: fetchedEvent
        })
        const result = await booking.save();
        return transformBooking(result)
    }
}