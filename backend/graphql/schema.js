import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Task {
    id: ID!
    text: String!
    completed: Boolean!
    completedAt: String
  }

  type Query {
    getTasks: [Task]
    getCurrentUser: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
    logout: String
    addTask(text: String!): Task
    toggleTask(id: ID!): Task
  }
`;

export default typeDefs;