import fs from "node:fs";
import { client as aiClient } from "../connections/openai.js";
import {
  askForAdditionalInput,
  askForPrSelection,
  askForRepoSelection,
} from "./cli.js";
import {
  type PRDetails,
  fetchMergedPRs,
  fetchPRDetails,
} from "./pullRequests.js";
import { searchRepositories } from "./repositories.js";

const OUTPUT_FILE_PATH = "CHANGELOG.md";

function getAIPrompt(
  prDetails: PRDetails[],
  additionalContext?: string,
): string {
  let prompt =
    "Generate a changelog entry the following pull requests in markdown. Do not repeat yourself and summarize based on context. Ignore boilerplate.";
  if (additionalContext) {
    prompt = `${prompt} ${additionalContext}`;
  }
  for (const prDetail of prDetails) {
    prompt = `
${prompt}

#${prDetail.number}
Title: ${prDetail.title}
Description: ${prDetail.description}
Commits: ${prDetail.commitMessages.join(", ")}
`;
  }
  return prompt;
}

async function generateAIChangelog(
  prs: PRDetails[],
  additionalContext?: string,
): Promise<string> {
  const prompt = getAIPrompt(prs, additionalContext);
  // console.log(`Generating changelog entry for pr #${pr.number} ${pr.title}`);
  const responseStream = await aiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });
  let response = "";
  for await (const chunk of responseStream) {
    response += chunk.choices[0]?.delta?.content || "";
  }
  return response;
}

async function saveChangeLog(
  content: string,
  outputFile: string,
): Promise<void> {
  // const content = `${entries.join("\n\n")}\n`;
  fs.writeFileSync(outputFile, content, "utf8");
  console.log(`Changelog saved to ${outputFile}`);
}

export async function generateChangelog(
  repoNameSearchString: string,
): Promise<void> {
  const repos = await searchRepositories(repoNameSearchString);
  const chosenRepo = await askForRepoSelection(repos);
  const prs = await fetchMergedPRs(chosenRepo);
  const chosenPrs = await askForPrSelection(prs);
  const prDetails = await Promise.all(
    chosenPrs.map((pr) => fetchPRDetails(pr)),
  );
  const additionalContext = await askForAdditionalInput();
  const changelog = await generateAIChangelog(prDetails, additionalContext);
  saveChangeLog(changelog, OUTPUT_FILE_PATH);
}
