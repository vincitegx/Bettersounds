export interface StreamState {
  playing?: boolean;
  paused?: boolean;
  readableCurrentTime?: string;
  readableDuration?: string;
  duration?: number | undefined;
  currentTime?: number | undefined;
  canplay?: boolean;
  error?: boolean;
  audio?: AudioBuffer;
  currentTimeSecs?: number;
  currentTimeMins?: number;
  durationSecs?: number;
  durationMins?: number;
  playSound?: AudioBufferSourceNode;
  // currentTimeText: string;
  // durationText: string;
  // secs: number;
  // mins: number;
}