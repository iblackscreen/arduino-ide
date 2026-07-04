// @ts-check
'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

// electron-builder skips code signing entirely when no certificate is
// available. Unsigned app bundles cannot be opened on Apple Silicon because
// Gatekeeper reports them as damaged. Ad-hoc sign the packed bundle so that
// unsigned builds remain usable via right-click > Open.
exports.default = async function adhocSign(context) {
  const { electronPlatformName, appOutDir, packager } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }
  if (process.env.CAN_SIGN === 'true') {
    console.log('Skipping the ad-hoc signing: the app is signed with a certificate');
    return;
  }
  const appPath = path.join(
    appOutDir,
    `${packager.appInfo.productFilename}.app`
  );
  console.log(`Ad-hoc signing ${appPath}`);
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], {
    stdio: 'inherit',
  });
};
