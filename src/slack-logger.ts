import { Logging } from '@google-cloud/logging';
import { Destination, Options } from './types';

const logging = new Logging();
const logSync = logging.logSync('slack');

export const sendLogMessages = async (
  destination: Destination,
  log: Record<string, any>,
  options: Options,
): Promise<void> => {
  const metadata = {
    severity: 'NOTICE',
    'logging.googleapis.com/labels': { type: 'pino-gcl-slack-transport' },
    'logging.googleapis.com/operation': {
      producer: 'github.com/bjerkio/google-cloud-logger-slack@v1',
    },
  };

  const parsedJson = logSync
    .entry(metadata, {
      slack: {
        channel: options.defaultChannel,
        ...log,
      },
    })
    .toJSON();
  destination.write(JSON.stringify(parsedJson));
};
