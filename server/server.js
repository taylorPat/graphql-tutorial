const typeDef = `#graphql
    type Query {
        greeting: String
    }
`;

const resolver = {
    Query: {
        greeting: () => 'Hello World!'
    }
};