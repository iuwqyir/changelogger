# Changelog generator

To generate a changelog, run `pnpm start` with the repo name to search for

For example `pnpm start rpc`

## Required api keys

1. Personal Access Token for Github.
   You can get it from https://github.com/settings/tokens. You can use both the fine grained token (recommended) or the classic token.
   Required permissions:

- Search for repositories
- Read a repository's PRs
- Read a PR's commit messages

2. OpenAI api key
   You can get it from https://platform.openai.com/api-keys.
   Note that this needs credits and is not free!

## Changing configuration values

By default the organization for narrowing search, github access token and openai api key will be stored in a `.env` file of this project. If you need to change them you can either change the values manually or delete the `.env` file and the program will ask you for the values again.
