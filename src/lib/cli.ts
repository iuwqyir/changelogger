import inquirer from "inquirer";
import type { MergedPR } from "./pullRequests.js";
import type { Repository } from "./repositories.js";

export async function askForRepoSelection(
  repositories: Repository[],
): Promise<Repository> {
  const repoChoices = repositories.map((data) => ({
    name: data.full_name,
    value: data,
  }));

  const answers = await inquirer.prompt<{ repo: Repository }>([
    {
      type: "list",
      name: "repo",
      message: "Select repo",
      choices: repoChoices,
      loop: false,
    },
  ]);
  return answers.repo;
}

export async function askForPrSelection(prs: MergedPR[]): Promise<MergedPR[]> {
  const prChoices = prs.map((pr) => ({
    name: `[${pr.base.ref}] #${pr.number} ${pr.title} by @${pr.user?.login}. (${new Date(pr.merged_at).toDateString()})`,
    value: pr,
  }));
  const answers = await inquirer.prompt([
    {
      type: "checkbox",
      name: "prs",
      message: "select PRs to generate changelogs with",
      choices: prChoices,
      loop: false,
    },
  ]);
  return answers.prs;
}

export async function askForGithubToken(): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: "password",
      name: "githubToken",
      message:
        "Provide the Github Personal Access Token to use. You can get it from https://github.com/settings/tokens. It needs permissions to search for repositories, read a repository's PRs and read a PR's commit messages \n",
      mask: true,
    },
  ]);
  return answers.githubToken;
}

export async function askForOpenAIToken(): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: "password",
      name: "openAIToken",
      message:
        "Provide the OpenAI api key to use. You can get it from https://platform.openai.com/api-keys. \n",
      mask: true,
    },
  ]);
  return answers.openAIToken;
}

export async function askForAdditionalInput(): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "aiInput",
      message:
        "Do you want to add any additional context for the AI? Do it here \n",
    },
  ]);
  return answers.aiInput;
}
