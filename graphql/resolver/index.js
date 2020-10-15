const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');


const bcrypt = require('bcryptjs');

const singleEvent = async (eventId)=>{
    try{
        const event = await Event.findById(eventId);
        return {...event._doc,
            _id:event.id,
             creator:user.bind(this,event.creator )
        }
    }catch(err){
        console.log(err)
    }
}


const events= async eventIds =>{
    // this is mongo syntax means to find all the event given an array of ids
    try{
        const events = await Event.find({_id: {$in:eventIds}})
        return events.map(event=>{
            return {...event._doc, _id: event.id, creator: user.bind(this, event.creator)}
        })
        
    } catch(err){
        console.log(err)
    }
    
   
}



const user = async userId =>{

    try{
        const user = await User.findById(userId)
        return {
            ...user._doc,
             _id:user.id,
             password:null,
              createdEvents: events.bind(this, user._doc.createdEvents)}
    }catch(err){
        throw err;
    }
   
}

module.exports = {
    events:async ()=>{
        // mongoose populates the event object with the creator base don the ref we gave in the schema but
        // because we cannot also get events details we create a function called user that is going to fix this issue 
        // return Event.find().populate('creator').then(events =>{
        try{
            const events = await Event.find()
            return events.map(event =>{
               
                return {...event._doc, 
                    _id:event._doc._id,
                    date:new Date (event._doc.date).toISOString(),
                    creator:user.bind(this, event._doc.creator)
                   
                }
                
                // mongoose let us do _id:event.id
            })
        }catch(err){
            console.log(err)
        }
    },
    bookings: async ()=>{
        try{
            const bookings = await Booking.find();
            return bookings.map(booking=>{
                return {
                    ...booking._doc,
                    _id:booking.id,
                    user: user.bind(this,booking._doc.user),
                    event:singleEvent.bind(this,booking._doc.event),
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString()
                }
            })

        } catch(err){
            console.log(err)
        }
    },
    cancelBooking:async args =>{
        try{
            const booking = await  Booking.findById(args.bookingId).populate('event');
            const event = {...booking.event._doc,
                 _id:booking.event.id,
                creator:user.bind(this,booking.event._doc.creator)
                }
            await Booking.deleteOne({_id:args.bookingId})
            return event;
        }catch(err){
            console.log(err)
        }
    },
    createEvent: async (args)=> {
        // const event = {
        //     _id: Math.random().toString(),
        //     title:args.eventInput.title,
        //     description:args.eventInput.description,
        //     price:+args.eventInput.price,
        //     date: new Date().toISOString()
        // }
        try{

            const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator:'5f8792b3c7dc9749b0ae504f'
            })
            let createdEvent;
            const result = await event.save();
            createdEvent = {
                        ...result._doc, 
                        _id: result.id,
                        date:new Date (event._doc.date).toISOString(),
                        creator: user.bind(this,result._doc.creator)}
                        
            const creator = await User.findById('5f8792b3c7dc9749b0ae504f')
                    
        
            if(!user){
                throw new Error('User not found')
            }
            creator.createdEvents.push(event)
             await creator.save();

        
            return createdEvent
        } catch(err ){
            console.log(err)
        }
    },
    createUser: async args =>{

        try{
            const existingUser = await User.findOne({email:args.userInput.email})
            if(existingUser){
                throw new Error('User exist already')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email:args.userInput.email,
                password:hashedPassword
            });
            const result = await user.save();
            // we set the password to null because we dont want the user to retrive it 
            return {...result._doc,password:null ,_id:result.id}
        } catch(err){
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
        return {
            ...result._doc,
            id:result.id,
            user: user.bind(this,booking._doc.user),
            event:singleEvent.bind(this,booking._doc.event),
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: new Date(result.updatedAt).toISOString()
        }
    }
}