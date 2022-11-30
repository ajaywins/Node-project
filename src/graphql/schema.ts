import { gql } from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";
import { resolver as UserResolver } from "./resolver/user.resolver";

const typeDefs = gql`
  #scalar Upload

  ################################################################
  # User
  ################################################################
  type User {
    _id: String
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
    password: String
    role: String
  }
  input UserInput {
    _id: String
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
    password: String
    role: String
  }
  type Authentication {
    user: User
    token: String
    message: String
  }

  ######################################################################
  # Queries
  ######################################################################
  type Query {
    ################################################################
    # User
    ################################################################
    login(email: String!, password: String!): Authentication
    getUser: Authentication
  }

  ######################################################################
  # Mutation
  ######################################################################
  type Mutation {
    ################################################################
    # User
    ################################################################
    register(params: UserInput!): User
    update(params: UserInput): User
    delete(_id: String): Authentication

  }
`;
export const resolvers = merge(UserResolver);

export const executableSchema = makeExecutableSchema({
  resolvers: {
    // Upload: GraphQLUpload,
    ...resolvers,
  },
  typeDefs,
});
