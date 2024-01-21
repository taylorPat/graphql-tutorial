import { getCompany } from "./db/companies.js";
import { getJobs } from "./db/jobs.js";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
    },
    Job: {
        date: (job) => mapDate(job.createdAt),
        company: (job) => getCompany(job.companyId)
    },

    
};

function mapDate(date) {
    return date.slice(0, 'yyyy-mm-dd'.length)
}