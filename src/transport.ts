import { Writable } from 'stream';
import abstractTransport from 'pino-abstract-transport';
import { sendLogMessages } from './slack-logger';
import { Destination, Options } from './types';
import { buildSafeSonicBoom } from './utils';

export const build = (opts: Options): Writable => {
  let destination: Destination;

  if (
    typeof opts.destination === 'object' &&
    typeof opts.destination.write === 'function'
  ) {
    destination = opts.destination as Destination;
  } else {
    destination = buildSafeSonicBoom({
      dest: (opts.destination as string | number) || 1,
      append: opts.append,
      mkdir: opts.mkdir,
      sync: opts.sync, // by default sonic will be async
    });
  }

  return abstractTransport(source =>
    sendLogMessages(destination, source, opts),
  );
};

export default build;
