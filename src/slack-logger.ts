import { Logging } from '@google-cloud/logging';
import SonicBoom from 'sonic-boom';
import { type Options } from './types.js';

const logging = new Logging();
const logSync = logging.logSync('slack');

export const sendLogMessages = async (
  destination: SonicBoom,
  log: Record<string, unknown>,
  options: Options,
): Promise<boolean> => {
  const metadata = {
    'logging.googleapis.com/labels': { type: 'pino-gcl-slack-transport' },
    'logging.googleapis.com/operation': {
      producer: 'github.com/bjerkio/google-cloud-logger-slack@v1',
    },
  };

  if (log['slack']) {
    // If this is already formatted for Google Cloud Logger, only append
    // required labels.
    if (log['severity'] && log['message']) {
      return destination.write(JSON.stringify({ ...log, ...metadata }) + '\n');
    }

    const { slack, ...rest } = log;
    const parsedJson = logSync
      .entry(
        { ...metadata, severity: 'NOTICE' },
        {
          slack: {
            channel: options.defaultChannel,
            ...slack,
          },
          ...rest,
        },
      )
      .toStructuredJSON();
    return destination.write(JSON.stringify(parsedJson) + '\n');
  }

  return destination.write(JSON.stringify(log) + '\n');
};
