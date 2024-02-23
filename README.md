# Learning GraphQL programmatically

This page summarizes everything you should need to know about GraphQL in theory. In addition there are also practical examples.

## What is GraphQL?
Graphql is a query language for consuming data from an API but also a runtime for providing data to those API queries. It was developed by Facebook in 2012 and open sourced in 2015. Facebook wanted to define a new way for making requests to the server since there apps were very slow because of to many requests. They had the problem of overfetching and underfetching data (see below).

### What is the advantage of GraphQL?
- it provides complete and understandable description of the data in your API
-  the client can ask for what he needs
- easier evolving of a API over time
- enables powerful developer tools

### Why do we need GraphQL when there is REST?
- GraphQL prevents you from *overfetching* which means you just get the data you need (REST does not prevents you from *overfetching* because there is a fixed response schema)
- With GraphQL you can get many resources with just one request and so avoids *underfetching* (with REST you probably need to make more requests to get the same data or you have to define a batch route) 
- Defined schemas which fully represents your API (=typed system) (for REST when you use the OpenAPI specification you also provide typed systems)
- Evolve your API without versions
- You can bring GraphQL easily into your system without changing your data or business logic since GraphQL provides the api layer

## GraphQL in action: Define your first GraphQL API

### 1. Define a schema
First we define a ``server.js`` file:

```js
const typeDefs = `#graphql
    schema {
        query: Query
    }

    type Query {
        greeting: String
    }
`
```
<details>
<summary>Colapse here to see the full server.js</summary>

```js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer} from '@apollo/server/standalone';

const typeDefs = `#graphql
    schema {
        query: Query
    }

    type Query {
        greeting: String
    }
`

const resolvers = {
    greeting: () => 'Hello World'
}

const server = new ApolloServer({ typeDefs, resolvers });
const info = await startStandaloneServer(server, { listen: {port: 9000}});
console.log(`Server is running at $(info.url)`);

```
</details>

In this example ``typeDefs`` represents the interface of your API and declares which fields a client can request. It use the schema definition language which was defined to create a graphql schema.

> [!TIP]  
> You do not have to explicitly define the schema in this case because like this it is defined by default


### 2. Define a resolver function
In addition you also need to a asign a value to your defined fields through defining a ``resolvers`` function:
```js
const resolvers = {
    greeting: () => 'Hello World'
}
```

### 3. Install the dependencies 
Now we want to expose our API over HTTP, the most common way to provide GraphQL APIs to the client. To do so we use a libary called ``Apollo Server`` which is a popular GraphQL implementation for javascript.

First we define a ``package.json``
```json
{
    "name": "my-first-graphql-api",
    "private": true,
    "type": "module",
}
```
Then in your terminal run:
``>>> npm install @apollo/server graphql``

This will install two packages:
- apollo/server which will expose your API via HTTP
- graphql which will provide core graphql functionality

### 4. Define Apollo server
```js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer} from '@apollo/server/standalone';

# schema 
# resolver

const server = new ApolloServer({ typeDefs, resolvers });
const info = await startStandaloneServer(server, { listen: {port: 9000}});
console.log(`Server is running at $(info.url)`);

```
> [!TIP]  
> Using so called Backtick delimited strings aka template literal you can insert an expression into your string

> [!TIP]  
> You could use object destructuring to unpack properties of an object. For example you could write ``const { url }`` instead of ``const info`` and then use it directly in the console log instead of ``info.url``

### 5. Run the server
To provide your first GraphQL API over HTTP run apollo server:

``>>> node server.js``

It will open a page in the browser which is called Apollo Sandbox. You can use this tool to make GraphQL queries. Sandbox is a web based GraphQL client which provides you the oportunity to call any GraphQL API.

## Implement the clients code
TBD

## Apollo Server with Express, Custom Object Types, Arrays and Nullability
TBD

## Handling errors
When the server encounters errors to handle the query it sends back a list of errors inside the response (``"data": [], "errors": [...]``) that have occured while the query was executed. Inside this error array you get information about each error containing an error code plus the stacktrace.

There are different built-in errors defined by apollo you can handle (https://www.apollographql.com/docs/apollo-server/data/errors#built-in-error-codes). 

But in addition you can also create custom errors like so:

```js
import { GraphQLError } from 'graphql';

throw new GraphQLError(message, {
  extensions: { code: 'YOUR_ERROR_CODE', myCustomExtensions },
});
```
> [!TIP]  
> You can provide abitrary fields to the error's extension object to provide useful information to the client

## Mutations
Until now we were only able to read data from our GraphQL API. But in real world scenarios we also want to give the client the ability to send new data to the GraphQL API so that the server can save this data inside the database.

In GraphQL we can achieve this by defining ***mutations***. 

Let's implement a mutation inside our ``graphql.schema``:
```js
type Mutation {
  createJob(title: String!, description: String): Job
}
```
We introduce a new object type called ``Mutation``. Until now we have just used the object type ``Query`` to read data from our API. In order to write data to the API we now need to define an object type ``Mutation``.

Inside the ``Mutation`` you pass it the ``createJob`` operation which gets the arguments ``title`` and ``description``. You can see that the ``title`` is mandatory by looking at the type hint ``String!`` and the ``description`` is optional ``String``. It follows the type definition of the object type ``Job``.

As always after defining the schema we have to implement the resolver function.

Let's jump into your ``resolvers.js``:

```js
export const resolvers = {
  # Query

  Mutation: {
    createJob: (_root, { title, description }) => {
      const companyId = 'FjcJCHJALA4i'
      const job = createJob({companyId, title, description})
      return job
    }
  },

  # Company

  # Job
}
```

> [!NOTE]  
> For testing the mutation we hardcoded the ``companyId = 'FjcJCHJALA4i'``.
### Test the API

And that's it. Now lets check in the Apollo Sandbox:  
Start your apollo server by running ``node server.js`` inside your ``/server`` folder and open ``localhost:9000/graphql`` in your browser.

> [!NOTE]  
> At the beginning you have to install the dependencies by running ``npm install`` to make the service run succesfully.

Now define the following mutation to define a new custom object tpye ``Job`` item:
```graphql
mutation {
  createJob(title: "Devops", description: "a small description") {
    id
    date
    title
    company {
      id
      name
    }
  }
}
```
The response should look as follow:
```json
{
  "data": {
    "createJob": {
      "id": "WfNhdAUShTvU",
      "date": "2024-02-04",
      "title": "Devops",
      "company": {
        "id": "FjcJCHJALA4i",
        "name": "Facegle"
      }
    }
  }
}
```

A more common way is to define your args in the variable section:

<details>
<summary>Collapse here to see the full alternative</summary>

Define the mutation like this:
```graphql
mutation CreateJob($title: String!, $description: String) {
  createJob(title: $title, description: $description) {
    id
    date
    title
    company {
      id
      name
    }
  }
}
```
And then you can implement the variables like:
```json
{
  "title": "DevOps",
  "description": "A small description"
}
```
> [!CAUTION]  
> This way you can separte the definition of your arguments from the mutation but you have to write huge amount of boilderplate code and it will get even worse with more and more arguments.
</details>

### Input types
To overcome the drawback of having to many variables while using the variables section there is a server side fix.

Rewrite your ``schema.graphql`` that it looks like as followed:
```graphql
type Mutation {
  createJob(input: CreateJobInput!): Job
}

input CreateJobInput {
  title: String!
  description: String
}
```
We defined a new custom object type ``CreateJobInput`` which is of type ``input``. It is used as an argument inside the ``createJob`` mutation.

> [!NOTE]  
> ``type`` vs. ``input``: object types like ``type`` are **output types** which respresent data the server sends back to the client. While on the other side the ``input`` type is an object that is send by the client and can only be used as an argument.

Besides that you also have to make a small adaption inside your ``resolver.js`` file:  
``createJob: (_root, { input: {title, description }})``  

The whole mutation then looks like:
```js
  Mutation: {
    createJob: (_root, { input: {title, description }}) == => {
      const companyId = 'FjcJCHJALA4i'
      const job = createJob({companyId, title, description})
      return job
    }
  },
```
Rerun your server and jump back to the apollo Sandbox and adapt your muatation:
```graphql
mutation CreateJob($input: CreateJobInput!) {
  createJob(input: $input) {
    id
    date
    title
    company {
      id
      name
    }
  }
}
```
And the variables section looks like:
```json
{
  "input": {
    "title": "DevOps",
    "description": "A small description"
    }
}
```
Run the mutation again and you will get the same result.
> [!TIP]  
> In the mutation you can prefix the ``createJob`` like ``job: createJob(input: $input)``. With that small adaption you get a ``"job"`` object inside your json response.

## Caching for the client
In this chapter we are going through the process of caching on the client side. This will make our FE more performant in a way that we do not have to make multiple calls for getting the same data from the server. 

For this we have to run 
```bash
npm install @apollo/client
```
 in our terminal to install ``@apollo/client``. 

 We will now migrate step by step our current implementation which uses ``graphql-request`` to ``@apollo/client``.

 ### 1. Instanciate Apollo Client
 Inside ``client/src/lib/graphql/queries.js`` we instanciate the ``ApolloClient`` defining an ``uri`` and a ``cache``.
 ```js
import { GraphQLClient, gql} from 'graphql-request';
import { ApolloClient, InMemoryCache } from '@apollo/client'

const apolloClient = new ApolloClient({
  uri: 'http://localhost:9000/graphql', 
  cache: new InMemoryCache()
  }
)
 ```
 >[!TIP]  
 > **U**niform **R**esource **I**dentifier vs. **U**niform **R**esource **L**ocator vs. **U**niversal **R**esource **N**ame  
 > An URI is a string which identifies any resource using a name and / or a location and differs it from other resources whereas a URL just defines a location of a unique resource. A URN is a location independent identifier.  
 > Example URI: ISBN-0-422-34567-9  
 > Example URL: https://test.de (domain plus port)

 ### 2. Replace the gql function from graphql-request by apollo/client
 We now replace the gql function from graphql-request by @apollo/client.
  ```js
import { GraphQLClient} from 'graphql-request';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
 ```
 Using the gql function from ``@apollo/client`` has the advantage of parsing an GraphQL query string into the standard GraphQL AST. The type of the returned object is no langer a string but a document node. And that type is needed for the ``ApolloClient``. By the way it also parses the string, so you will notify if there is an syntax error.

>[!TIP]  
> AST stands for Abstract Syntax Tree which is an object that represents the structure of a GraphQL query or mutation.


 We still use the ``GraphQLClient`` in our implementation and your app is still running because the ``GraphQLClient`` can also handle document node next to a template literal.

 ### 3. Queries: Replace the GraphqlClient by the ApolloClient
 Now we can use the ``ApolloClient`` and call the ``query`` method giving it the ``query`` object as an argument. 

 ```js
 export async function getJobs() {
  const query = gql`
    #  query
  `;
  // const { jobs } = await client.request(query);
  const result = await apolloClient.query({query});
  return result.data.jobs;
}
 ```
When you need to add variables to your query e.g. when you call the ``getCompany`` or ``getJob`` functions then you simply add the ``variables`` argument to the query and pass it the ``id``.
```js
  const result = await apolloClient.query({
    query: query,
    variables: {
      id
    }
  });
  return result.data.company
```

### 4. Mutations: Replace the GraphqlClient by the ApolloClient
Apollo client uses so called links to send data to the server. You can define as many links as you want. For example we can use the createHttpLink method to create a link based on the uri.
```js
const httpLink = createHttpLink({uri: 'http://localhost:9000/graphql'})

const apolloClient = new ApolloClient({
  httpLink: httpLink,
  cache: new InMemoryCache()
  }
)
```

> [!TIP]  
> When you do not specify a createHttpLink but you just give the ApolloClient the uri (as we did before) then @apollo/client creates the http link implicitly.

Additionally we can define custom links. We need those e.g. to provide authorization within the @apollo/client:
```js
import { ApolloLink, concat } from '@apollo/client'

const customLink = new ApolloLink((operation, forward) => {
  console.log(`[customLink] operation:`, operation);
  return forward(operation);
})
```
You define a custom link by instanciating ApolloLink which gets a function which gets two arguments operation and forward. The operation is a graphql query or mutation and the forward is a function which forwards the operation.

We can then use the httpLink togethere with our custom link by concatenating both:
```js
const apolloClient = new ApolloClient({
  httpLink: concat(customLink, httpLink),
  cache: new InMemoryCache()
  }
)
```
For implementing authorization inside our ApolloClient we define following link:
```js
const customLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext(
      {
        headers: {'Authorization': `Bearer ${accessToken}`},
      }
  );
  }
  return forward(operation);
});
```
The app is still working. We replaced the graphql-request client with the @apollo/client.

> [!TIP]  
> data normalization  
> Saving each object separately avoids duplication and therefore makes the cache use less memory.

> [!TIP]  
> Download the apollo client devtool for your browser to inspect the data which is queried and cached.

### Cache policies
```js
export async function getJobs() {
  // query
  const result = await apolloClient.query({
    query,
    fetchPolicy: 'cache-first'
  });
  return result.data.jobs;
```
Within the query method of the ApolloClient instance you can define a fetchPolicy attribute which accepts different values. Some are listed here:
- cache-first (default)
- network-only for always fetchin the data from the server

Instead of defining the fetch policy inside each query you can also define a default behaviour inside the ApolloClient for different operations:
```js
const apolloClient = new ApolloClient({
  httpLink: concat(customLink, httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only'
    }
  }
  }
)
```
> [!TIP]  
> Also see the documentation for further policies https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies

### Cache manipulation
When we create a new job, after pressing submit we are forwarded to the new job details page. This process is doing two graphql operations. The first one to create a job (mutation, returns jobId) and the second one to query the job by id to show the job in the job details page.

There is a more performant way. Let's have a look.
The idea is to make just one graphql operation. This means when we create a new job on the client side, we do want to get the whole job object in return rather than just the jobId. This job object is then saved directly in the cache, where we can access it when creating the job details page.

```js
export async function createJob( {title, description}) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        date
        title
        company {
          id
          name
        }
        description
      }
    }
  `
  const result = await apolloClient.mutate({
    mutation: mutation,
    variables: {
      input: { title, description },      
    },
    update: (cache, {data}) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data: data
      })
    }
  })
  return result.data.job
}
```

As mentioned the ``createJob`` now returns the full job object, which we then use in the update argument which we added now. This update argument gets the cache and the data returned from the mutation (in our case the job object) and writes it to the cache. To do so it needs to now the query but instead of sending an additional query to the server, the update method queries the cache with the defined query (jobByIdQuery) and additionally define the variables as you do when querying data from the server. Furthermore you define the data you want to write to the cache.

### Fragments
In GraphQL you can avoid boilerplate code by using fragments.

In your apollo sandbox you define the operation like so:
```gql
query GetJobById($id: ID!) {
  job(id: $id) {
    ...JobDetail
  }
}

fragment JobDetail on Job {
  id
  description
}
```
And the variables section just defines the job id:
```gql
{"id": "f3YzmnBZpK0o"}
```

In javascript code it looks a little different:
```js
const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;

const jobByIdQuery = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;
```
The defintion is the same like in the sandbox but using the fragment inside your query you make use of the backtick delimited sting to use the fragment as expression. This way you have the same structure as in the sandbox (the query and the fragment are defined inside the operation section).