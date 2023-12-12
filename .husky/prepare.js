const isCi = process.env.CI !== undefined;
if (!isCi) {
  /* eslint-disable @typescript-eslint/no-var-requires */
  // eslint-disable-next-line global-require
  require('husky').install();
  const fs = require('fs');
  const path = require('path');
  fs.chmodSync(path.resolve(__dirname, './pre-commit'), '700');
  fs.chmodSync(path.resolve(__dirname, './commit-msg'), '700');
  fs.chmodSync(path.resolve(__dirname, './pre-push'), '700');
}
