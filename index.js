const logo = `
   ▓▓▓▓▓  ▓▓▓▓▓▓▓
               ▓▓▓▓
      ▓▓▓▓▓▓▓    ▓▓▓▓
               ▓▓▓▓
          ▓▓▓▓▓▓▓`

const docs = 'https://docs.dadi.tech'

const cliTable = require('cli-table2')
const colors = require('colors')
const concierge = require('ora')()
const dadiStatus = require('@dadi/status')

// Make some tables we can use to pretty print data

const header = new cliTable({
  colWidths: [42],
  chars: { 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '', 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
  style: { 'padding-left': 1, 'border': ['grey'], head: []},
  wordWrap: true
})

const body = new cliTable({
  colWidths: [14, 27],
  chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  style: { 'padding-left': 1, 'border': ['grey'] },
  wordWrap: true
})

const footer = new cliTable({
  colWidths: [14, 27],
  chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '' },
  style: { 'padding-left': 1, 'border': ['grey'], head: []},
  wordWrap: true
})

/**
 * Adds a loading spinner to the cli with the product name
 * @param {product} product - The name of the app, passed from the app's package.json
 */

// Make these globally available
let pkg 
let statusPayload 

module.exports.start = product => {
  pkg = product
  statusPayload = {
    package: pkg.npm,
    version: pkg.version,
    healthCheck: {
      routes: []
    }
  }
  concierge.start(`Starting ${pkg.human}…`)
  concierge.color = 'white'
}

/**
 * If the app starts successfully this prints a welcome message
 * @object {info} info - An object of info to tell the user (where the app is, node versions etc)
 */

module.exports.started = info => {
  Object.keys(info.header).map(i => header.push([info.header[i]]))
  Object.keys(info.body).map(i => body.push([i.green, info.body[i]]))
  Object.keys(info.footer).map(i => footer.push([i, info.footer[i]]))

  // Check if this is latest version
  dadiStatus(statusPayload, (err, data) => {
    if (data.service && data.service.versions) {
      const versions = data.service.versions
      if (versions.current !== versions.latest) {
       concierge.info(`A newer version of ${pkg.human} is available: ${versions.latest}`)
      }
    }
  })

  concierge.succeed(`Started ${pkg.human}\n${`@`.green} ${info.server.underline}
  
  ${header.toString().split('\n').join('\n  ')}
  ${body.toString().split('\n').join('\n  ')}
  ${footer.toString().split('\n').join('\n  ')}

  ${`ℹ`.green} Documentation at ${docs}
  ${`ℹ`.green} <CTRL> + C to shut down

  ${logo}


  ${`© ${new Date().getFullYear()} DADI+ Limited (https://dadi.tech)\n  All rights reserved.`.grey}
  `)
}

/**
 * Prints an exit error and kills the process
 * @param {err} error - A text description of the error
 */

module.exports.error = err => {
  concierge.fail(`${err}`.red)
  process.exit(0)
}

/**
 * Prints a shutdown message and kills the process
 * @param {err} error - A text description of the error
 */

module.exports.stopped = message => {
  concierge.fail(`Stopping & exiting ${pkg.human}.`.red)
  process.exit(0)
}