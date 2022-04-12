import SonicBoom, { SonicBoomOpts } from 'sonic-boom';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop: any = () => {};

export const buildSafeSonicBoom = (opts: SonicBoomOpts): SonicBoom => {
  const stream = new SonicBoom(opts);
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
