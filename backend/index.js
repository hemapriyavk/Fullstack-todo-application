// server/server.js
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import session from 'express-session';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import db from './config/db.js';
import 'dotenv/config';


const app = express();

app.use(cors({
    origin: ['https://fullstack-todo-application.vercel.app', 'https://studio.apollographql.com'],
    credentials: true
  }));
  
app.use(express.json());
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: false }
}));
db;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});


  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.listen(4000, () => console.log('🚀 Server ready at http://localhost:4000/graphql'));
