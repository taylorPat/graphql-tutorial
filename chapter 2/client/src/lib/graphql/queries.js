import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient('http://localhost:9000/graphql')

export async function getCompany(id) {
    const query = gql`
        query CompanyById ($id: ID!) {
            company (id: $id) {
                id 
                name 
                description
            }
        }    
    `;
    const data = await client.request(query, { id });
    return data.company;
}

export async function getJob(id) {
    const query = gql`
        query JobById ($id: ID!) {
            job (id: $id) {
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
    const data = await client.request(query, { id });
    return data.job;
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
    const {jobs} = await client.request(query);
    return jobs;
}