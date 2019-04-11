var path = require('path')

exports.default = async function(configuration) {
  console.log('---------------------------------------------------')
  console.log('Signing ', configuration.path)

  const signCmd = `"C:/Program Files (x86)/Windows Kits/10/bin/10.0.17763.0/x64/signtool.exe" sign /a "${
    configuration.path
  }"`

  require('child_process').execSync(signCmd)
}
