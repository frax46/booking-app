const Event = require('../../models/event');
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
            createdEvent = transformEvent(result)
                        
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
}