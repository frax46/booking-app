const express = require('express');
const bodyParser = require('body-parser')

const {graphqlHTTP} =  require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql',graphqlHTTP({
    schema: buildSchema(`
    type RootQuery{
        events : [String!]!
    }

    type RootMutation{
        createEvent(name:String): String
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }`),
    rootValue:{
        events:()=>{
            return ['Romantic cooking','Sailing','All-Night Coding']
        },
        createEvent:(args)=>{
            const eventName = args.name;
            return eventName
        }
    },
    graphiql:true
}))

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`server running in port ${PORT}`)
})