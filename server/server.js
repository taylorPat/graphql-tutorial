import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
    type Query {
        greeting: String
    }
`;

const resolver = {
    Query: {
        greeting: () => 'Hello World!'
    }
};

const server = new ApolloServer({typeDefs: typeDefs})
const {url} = await startStandaloneServer(server, {listen: {port: 9000}})
console.log(`Server running at ${url}`) // backtick delimited string or template literal