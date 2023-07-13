# pino-gcl-slack-transport

This is a Pino transport for [google-cloud-logger-slack].

[google-cloud-logger-slack]:
  https://github.com/bjerkio/google-cloud-logger-slack

## Usage

```sh
pnpm install pino-gcl-slack-transport
```

```js
import { pino } from 'pino';

const pino = pino({
  transport: {
    target: 'pino-gcl-slack-transport',
    options: {
      defaultChannel: '<channel id>',
    },
  },
});
```

See [types.ts](./src/types.ts) for the full list of options.
