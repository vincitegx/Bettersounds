import { Beat } from "../models/beat";

export interface AudioPlayera {

    musicRenderStatus: any;
    audio: AudioBuffer;
    ctx: AudioContext;
    currentTime: number;
    duration: number;
    currentTimeText: string;
    durationText: string;
    secs: number;
    mins: number;
    playSound: AudioBufferSourceNode;
    beat: Beat;
    initializeAudio(): void;

}