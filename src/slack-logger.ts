import { Logging } from '@google-cloud/logging';
import SonicBoom from 'sonic-boom';
import { Options } from './types';

const logging = new Logging();
const logSync = logging.logSync('slack');

export const sendLogMessages = async (
  destination: SonicBoom,
  log: Record<string, any>,
  options: Options,
): Promise<boolean> => {
  const metadata = {
    severity: 'NOTICE',
    'logging.googleapis.com/labels': { type: 'pino-gcl-slack-transport' },
    'logging.googleapis.com/operation': {
      producer: 'github.com/bjerkio/google-cloud-logger-slack@v1',
    },
  };

  if (log.slack) {
    const { slack, ...rest } = log;
    const parsedJson = logSync
      .entry(metadata, {
        slack: {
          channel: options.defaultChannel,
          ...slack,
        },
        ...rest,
      })
      .toStructuredJSON();
    return destination.write(JSON.stringify(parsedJson) + '\n');
  } else {
    return destination.write(JSON.stringify(log) + '\n');
  }
};
