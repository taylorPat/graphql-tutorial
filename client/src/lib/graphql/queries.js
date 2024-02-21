import { GraphQLClient} from 'graphql-request';
import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, gql, concat } from '@apollo/client'
import {getAccessToken} from '../auth';


const httpLink = createHttpLink({uri: 'http://localhost:9000/graphql'})

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

const apolloClient = new ApolloClient({
  httpLink: concat(customLink, httpLink),
  cache: new InMemoryCache()
  }
)

export async function createJob( {title, description}) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `
  const result = await apolloClient.mutate({
    mutation: mutation,
    variables: {
      input: { title, description }
    },
  })
  return result.data.job
}

export async function getCompany(id) {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;
  const result = await apolloClient.query({
    query: query,
    variables: {
      id
    }
  });
  return result.data.company
}

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
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
  `;
  const result = await apolloClient.query( {
    query: query,
    variables: {
      id
    }
  });
  return result.data.job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;
  const result = await apolloClient.query({
    query,
    fetchPolicy: 'cache-first'
  });
  return result.data.jobs;
}
