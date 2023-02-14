export class StreamState {

  playing?: boolean;
  paused?: boolean;
  readableCurrentTime?: string;
  readableDuration?: string;
  duration?: number | undefined;
  currentTime?: number | undefined;
  canplay?: boolean;
  error?: boolean;
  audio?: AudioBuffer;
  playSound?: AudioBufferSourceNode;
  currentTimeSecs?: number;
  currentTimeMins?: number;
  durationSecs?: number;
  durationMins?: number;

  constructor(playing?: boolean, paused?: boolean, readableCurrentTime?: string,
    readableDuration?: string, duration?: number, currentTime?: number,
    canplay?: boolean, error?: boolean
  ) {
    this.playing = playing;
    this.paused = paused;
    this.canplay = canplay;
    this.currentTime = currentTime;
    this.duration = duration;
    this.error = error;
    this.readableCurrentTime = readableCurrentTime;
    this.readableDuration = readableDuration;
  }
}
