import type { GetResponseTypeFromEndpointMethod } from "@octokit/types";
import { client } from "../connections/github.js";
import type { Repository } from "./repositories.js";

export type PR = GetResponseTypeFromEndpointMethod<
  typeof client.rest.pulls.list
>["data"][0];

export type PRCommits = GetResponseTypeFromEndpointMethod<
  typeof client.rest.pulls.listCommits
>["data"];

export type MergedPR = PR & {
  merged_at: string;
};

export type PRDetails = {
  number: number;
  title: string;
  description?: string;
  commitMessages: string[];
};

export async function fetchMergedPRs(repo: Repository): Promise<MergedPR[]> {
  if (!repo.owner?.login) return [];
  const res = await client.rest.pulls.list({
    repo: repo.name,
    owner: repo.owner.login,
    state: "closed",
  });
  const mergedPrs: MergedPR[] = res.data.filter(
    (pr): pr is MergedPR => !!pr.merged_at,
  );
  return mergedPrs.sort(
    (a, b) => new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime(),
  );
}

async function fetchPRCommits(
  repoName: string,
  prNumber: number,
  owner: string,
): Promise<PRCommits> {
  return await client.paginate(client.rest.pulls.listCommits, {
    repo: repoName,
    pull_number: prNumber,
    owner,
    per_page: 100,
  });
}

export async function fetchPRDetails(pr: PR): Promise<PRDetails> {
  const commits = await fetchPRCommits(
    pr.base.repo.name,
    pr.number,
    pr.base.repo.owner.login,
  );
  return {
    number: pr.number,
    title: pr.title,
    commitMessages: commits.map((commit) => commit.commit.message),
    ...(pr.body && { description: pr.body }),
  };
}
