const Event = require('../../models/event');
const User = require('../../models/user');

const {transformEvent} = require('./merge');







module.exports = {
    events:async ()=>{
        // mongoose populates the event object with the creator base don the ref we gave in the schema but
        // because we cannot also get events details we create a function called user that is going to fix this issue 
        // return Event.find().populate('creator').then(events =>{
        try{
            const events = await Event.find()
            return events.map(event =>{
               return transformEvent(event)
                // mongoose let us do _id:event.id
            })
        }catch(err){
            console.log(err)
        }
    },
    
    
    createEvent: async (args, req)=> {
        // const event = {
        //     _id: Math.random().toString(),
        //     title:args.eventInput.title,
        //     description:args.eventInput.description,
        //     price:+args.eventInput.price,
        //     date: new Date().toISOString()
        // }

        if(!req.isAuth){
            throw new Error('not authenticated')
        }
        try{

            const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator:req.userId
            })
            let createdEvent;
            const result = await event.save();
            createdEvent = transformEvent(result)
                        
            const creator = await User.findById(req.userId)
                    
        
            if(!creator){
                throw new Error('User not found')
            }
            creator.createdEvents.push(event)
             await creator.save();

        
            return createdEvent
        } catch(err ){
            console.log(err)
        }
    },
}