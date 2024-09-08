import fs from "node:fs";
import dotenv from "dotenv";
import { askForGithubToken, askForOpenAIToken } from "./cli.js";

const envFilePath = ".env";

function saveSecretToEnv(varName: string, value: string) {
  let envContent = "";
  if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, "utf-8");
  }
  const varRegex = new RegExp(`^${varName}=`, "m");
  if (!varRegex.test(envContent)) {
    // Append the new variable to the existing content
    const newContent = `${envContent}${envContent ? "\n" : ""}${varName}=${value}`;
    fs.writeFileSync(envFilePath, newContent, "utf-8");
    console.log(`Variable ${varName} saved to .env file.`);
    dotenv.config();
  } else {
    console.log(
      `Variable ${varName} already exists in the .env file. Please delete it from .env`,
    );
  }
}

export async function checkForSecrets(): Promise<void> {
  if (!process.env.GITHUB_TOKEN) {
    const githubToken = await askForGithubToken();
    saveSecretToEnv("GITHUB_TOKEN", githubToken);
  }
  if (!process.env.OPENAI_API_KEY) {
    const openAiToken = await askForOpenAIToken();
    saveSecretToEnv("OPENAI_API_KEY", openAiToken);
  }
}
