import { DestinationStream } from 'pino';

export interface Options {
  /**
   * This option is used when channel isn't defined
   * in the log entry. Read more about the Slack object.
   */
  defaultChannel?: string;

  /**
   * The file, file descriptor, or stream to write to.  Defaults to 1 (stdout).
   * @default 1
   */
  destination?: string | number | DestinationStream | NodeJS.WritableStream;

  /**
   * Opens the file with the 'a' flag.
   * @default true
   */
  append?: boolean;
  /**
   * Ensure directory for destination file exists.
   * @default false
   */
  mkdir?: boolean;

  /**
   * Makes messaging synchronous.
   * @default false
   */
  sync?: boolean;
}

export type Destination = {
  write(string: string): boolean;
}
