const express = require ('express');
const color = require('colors');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/scheme');
const cors = require('cors');
const connectDb = require('./config/db.js');
const port = process.env.PORT || 5000;

const app = express();
connectDb();

app.use(cors());
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}))
app.listen(port,console.log(`Server running on port:${port}`));