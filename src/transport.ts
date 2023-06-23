import { once } from 'events';
import { Writable } from 'stream';
import abstractTransport from 'pino-abstract-transport';
import SonicBoom from 'sonic-boom';
import { sendLogMessages } from './slack-logger.js';
import { type Options } from './types.js';
import { buildSafeSonicBoom } from './utils.js';

export default async (opts: Options = {}): Promise<Writable> => {
  let destination: SonicBoom;

  if (
    typeof opts.destination === 'object' &&
    typeof opts.destination.write === 'function'
  ) {
    destination = opts.destination as SonicBoom;
  } else {
    const { append = true, mkdir = false, sync = false } = opts;
    destination = buildSafeSonicBoom({
      dest: (opts.destination as string | number) || 1,
      append,
      mkdir,
      sync, // by default sonic will be async
    });
  }

  await once(destination, 'ready');

  return abstractTransport(
    async source => {
      for await (const obj of source) {
        const toDrain = !sendLogMessages(destination, obj, opts);

        if (toDrain) {
          await once(destination, 'drain');
        }
      }
    },
    {
      async close() {
        destination.end();
        await once(destination, 'close');
      },
    },
  );
};
