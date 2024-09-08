import { Octokit } from "octokit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const client = new Octokit({
  auth: GITHUB_TOKEN,
});

export default { client };
