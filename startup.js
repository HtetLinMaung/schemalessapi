require("dotenv").config();
const { exec } = require("code-alchemy/child_process");

async function main() {
  const modules = process.env.modules;
  if (modules) {
    for (const moduleName of modules.split(",")) {
      try {
        require(moduleName);
      } catch (err) {
        const { stdout, stderr } = await exec(`npm i ${moduleName}`);
        console.log(stdout);
        console.log(stderr);
      }
    }
  }
}
main();
