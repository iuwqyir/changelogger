import dotenv from "dotenv";
dotenv.config();

import { checkForSecrets } from "./lib/secrets.js";

(async () => {
  const searchString = process.argv[2];

  if (!searchString) {
    console.error(
      "Please specify a repository to search for as the first argument to the command",
    );
    process.exit(1);
  }

  await checkForSecrets();

  const changelogGenerator = await import("./lib/changelog.js");
  await changelogGenerator.generateChangelog(searchString);
})();
