import chalk from "chalk"

const envs = [
  "CRON", // Y/N
  "REMOTE_FUN", // Y/N
  "REMOTE_FUN_KEY",
  "IG_SESSIONID"
]

for (const env of envs) {
  if (!process.env.hasOwnProperty(env)) {
    const message = "Add \"" + env + "\" in .env before starting server."
    throw new Error(chalk.red(message))
  }
}
