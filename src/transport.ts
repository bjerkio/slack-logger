import { once } from 'events';
import { Writable } from 'stream';
import abstractTransport from 'pino-abstract-transport';
import SonicBoom from 'sonic-boom';
import { sendLogMessages } from './slack-logger';
import { Options } from './types';
import { buildSafeSonicBoom } from './utils';

const build = async (opts: Options = {}): Promise<Writable> => {
  let destination: SonicBoom;

  if (
    typeof opts.destination === 'object' &&
    typeof opts.destination.write === 'function'
  ) {
    destination = opts.destination as SonicBoom;
  } else {
    destination = buildSafeSonicBoom({
      dest: (opts.destination as string | number) || 1,
      append: opts.append,
      mkdir: opts.mkdir,
      sync: opts.sync, // by default sonic will be async
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

export = build;
