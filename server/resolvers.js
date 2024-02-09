import { GraphQLError } from 'graphql';
import { getCompany } from './db/companies.js';
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from './db/jobs.js';

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError('No Company found with id ' + id);
      }
      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError('No Job found with id ' + id);
      }
      return job;
    },
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_root, { input: {title, description }}) => {
      console.log(`Root: ${_root}, `)
      const companyId = 'FjcJCHJALA4i'
      const job = createJob({companyId, title, description})
      return job
    },
    deleteJob: async (_root, { id }) => {
      const job = await deleteJob(id)
      return job
    },
    updateJob: async (_root, {input: { id, title, description }}) => {
      const job = await updateJob({ id, title, description})
      return job
    }
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
};

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}
