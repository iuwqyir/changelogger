import type { GetResponseTypeFromEndpointMethod } from "@octokit/types";
import { client } from "../connections/github.js";

export type Repository = GetResponseTypeFromEndpointMethod<
  typeof client.rest.search.repos
>["data"]["items"][0];

export async function searchRepositories(
  searchString: string,
): Promise<Repository[]> {
  const org = process.env.GITHUB_ORG;
  let q = searchString;
  if (org) {
    q = `${q} org:${org}`;
  }
  const res = await client.rest.search.repos({ q });
  return res.data.items;
}
