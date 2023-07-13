import SonicBoom, { type SonicBoomOpts } from 'sonic-boom';

// TODO: Fix types below

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
const noop: any = () => {};

export const buildSafeSonicBoom = (opts: SonicBoomOpts): SonicBoom => {
  const stream = new SonicBoom(opts);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterBrokenPipe = (err: any) => {
    if (err.code === 'EPIPE') {
      stream.write = noop;
      stream.end = noop;
      stream.flushSync = noop;
      stream.destroy = noop;
      return;
    }
    stream.removeListener('error', filterBrokenPipe);
  };
  stream.on('error', filterBrokenPipe);
  return stream;
};
