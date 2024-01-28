import { getCompany } from "./db/companies.js";
import { getJobs, getJob } from "./db/jobs.js";

export const resolvers = {
    Query: {
        job: (_root, {id}) => getJob(id),
        company: (_root, {id}) => getCompany(id),
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