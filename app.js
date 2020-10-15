const express = require('express');
const bodyParser = require('body-parser')

const bcrypt = require('bcryptjs')

const {graphqlHTTP} =  require('express-graphql');
const { buildSchema } = require('graphql');

// Databse
const mongoose = require('mongoose');
const Event = require('./models/event')
const User = require('./models/user')


const app = express();

const events= []

app.use(bodyParser.json());

app.use('/graphql',graphqlHTTP({
    schema: buildSchema(`
    type Event {
        _id:ID!
        title:String!
        description:String!
        price:Float!
        date:String!
    }
    type User {
        _id:ID!
        email:String!
        password:String
    }

    input EventInput{
        title:String!
        description:String!
        price:Float!
        date:String!
    }
    input UserInput{
        email:String!
        password:String!
    }

    type RootQuery{
        events : [Event!]!
    }

    type RootMutation{
        createEvent(eventInput: EventInput): Event
        createUser(userInput:UserInput): User
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }`),
    rootValue:{
        events:()=>{
            return Event.find().then(events =>{
                return events.map(event =>{
                    return {...event._doc, _id:event._doc._id.toString()}
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
                    createdEvent = {...result._doc, _id: result.id};
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
    },
    graphiql:true
}))

const PORT = process.env.PORT || 4000;



mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.d0ggr.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`server running in port ${PORT}`)
        })
    }).catch((err)=>{
        console.log(err)
    }
    
);


