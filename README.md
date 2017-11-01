# DADI Boot
> A module to help DADI apps boot uniformly.

## Usage

### Starting an app

In the file which is triggered by `npm start` e.g., `main.js`

```js
// Console start message
const dadiBoot = require('@dadi/boot')
dadiBoot.start(require('./package.json'))
```

`appName` looks at the `description` field in the `package.json` file, this should be the brand name for the app e.g., `DADI Web`

### Successfully started

Located where the app finishes its initialisation process.

```js
const dadiBoot = require('@dadi/boot')

dadiBoot.started({
  server: `${config.get('server.protocol')}://${config.get('server.host')}:${config.get('server.port')}`,
  header: {
    app: config.get('app.name')
  },
  body: {
    'Protocol': config.get('server.protocol'),
    'Version': version,
    'Node.js': nodeVersion,
    'Engine': enginesInfo,
    'Environment': config.get('env')
  },
  footer: {
    'DADI API': config.get('api.enabled') ? `${config.get('api.host')}:${config.get('api.port')}` : '\u001b[31mNot enabled\u001b[39m'
  }
})
```

> N.B. All fields are optional

#### `server`

The location where the app is launched or available for the user to be interacted with.

#### `header`

An object of strings to put in the header.

> N.B. The object keys are not currently used

#### `body`

An object of strings to output into a key|value table

#### `footer` 

An object of supplementary information which the user might need to know, e.g., status of other connected microservices

### Errors

Accepts a string which is output as red in the terminal.

```js
dadiBoot.error(err)
```

### Stopped

To be triggered anytime the app is shutdown. Accepts a string which is output as red in the terminal.

```js
dadiBoot.stopped('Extra message')
```
