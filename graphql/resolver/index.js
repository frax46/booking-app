const Event = require('../../models/event');
const User = require('../../models/user');

const bcrypt = require('bcryptjs');


const events= eventIds =>{
    // this is mongo syntax means to find all the event given an array of ids
    return Event.find({_id: {$in:eventIds}}).then(events =>{
        
        return events.map(event=>{
            return {...event._doc, _id: event.id, creator: user.bind(this, event.creator)}
        })
    }).catch(err=>{
        console.log(err)
    })
}



const user = userId =>{
    return User.findById(userId).then(user =>{
        
        return {...user._doc, _id:user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
    }).catch(err =>{
        throw err;
    })
}

module.exports = {
    events:()=>{
        // mongoose populates the event object with the creator base don the ref we gave in the schema but
        // because we cannot also get events details we create a function called user that is going to fix this issue 
        // return Event.find().populate('creator').then(events =>{
        return Event.find().then(events =>{

            return events.map(event =>{
               
                return {...event._doc, 
                    _id:event._doc._id,
                    date:new Date (event._doc.date).toISOString(),
                    creator:user.bind(this, event._doc.creator)
                   
                }
                
                // mongoose let us do _id:event.id
            })
        }).catch(err =>{
            console.log(err)
        })
    },
    createEvent:(args)=>{
        // const event = {
        //     _id: Math.random().toString(),
        //     title:args.eventInput.title,
        //     description:args.eventInput.description,
        //     price:+args.eventInput.price,
        //     date: new Date().toISOString()
        // }

        const event = new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price:+args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator:'5f8792b3c7dc9749b0ae504f'
        })
        let createdEvent;
        return event.save().then(result =>{
                createdEvent = {
                    ...result._doc, 
                    _id: result.id,
                    date:new Date (event._doc.date).toISOString(),
                     creator: user.bind(this,result._doc.creator
                )};
                return User.findById('5f8792b3c7dc9749b0ae504f')
                
        }).then(user =>{
            if(!user){
                throw new Error('User not found')
            }
            user.createdEvents.push(event)
            return user.save();

        }).then(result =>{
            return createdEvent
        }).catch(err =>{
            console.log(err)
        })
    },
    createUser: args =>{
        return User.findOne({email:args.userInput.email}).then(user=>{
            if(user){
                throw new Error('User exist already')
            }
            return bcrypt.hash(args.userInput.password, 12)
        })
        .then(hashedPassword =>{
                    const user = new User({
                        email:args.userInput.email,
                        password:hashedPassword
                    });
                    return user.save();
            }).then(result=>{
                // we set the password to null because we dont want the user to retrive it 
                return {...result._doc,password:null ,_id:result.id}
            }).catch(err =>{
            console.log(err)
        })
        
    }
}