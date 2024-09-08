import type { GetResponseTypeFromEndpointMethod } from "@octokit/types";
import { client } from "../connections/github.js";

const ORGANIZATION = "thirdweb-dev";

export type Repository = GetResponseTypeFromEndpointMethod<
  typeof client.rest.search.repos
>["data"]["items"][0];

export async function searchRepositories(
  searchString: string,
): Promise<Repository[]> {
  const res = await client.rest.search.repos({
    q: `${searchString} org:${ORGANIZATION}`,
  });
  return res.data.items;
}
