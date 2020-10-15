const express = require('express');
const bodyParser = require('body-parser')

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolver/index')

const {graphqlHTTP} =  require('express-graphql');


// Databse
const mongoose = require('mongoose');



const app = express();
app.use(bodyParser.json());


app.use('/graphql',graphqlHTTP({
    schema:graphQLSchema ,
    rootValue:graphQLResolvers,
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


