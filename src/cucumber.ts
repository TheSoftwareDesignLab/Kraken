const { Cli } = require('@cucumber/cucumber');

exports.default = async function run() {
  const cwd = process.cwd();
  const cli = new Cli({
    argv: process.argv.slice(2),
    cwd,
    stdout: process.stdout
  });

  let result;
  try {
    result = await cli.run();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const exitCode = result.success ? 0 : 1;
  if (result.shouldExitImmediately) {
    process.exit(exitCode);
  } else {
    process.exitCode = exitCode;
  }
};
