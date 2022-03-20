export class StreamState {

    playing: boolean;
    readableCurrentTime: string;
    readableDuration: string;
    duration: number | undefined;
    currentTime: number | undefined;
    canplay: boolean;
    error: boolean;

    constructor(playing: boolean=false, readableCurrentTime: string="00:00",
    readableDuration: string="", duration: number=null, currentTime: number=0.0, 
    canplay: boolean= true, error: boolean=false
    ){
        this.playing = playing;
        this.canplay = canplay;
        this.currentTime = currentTime;
        this.duration = duration;
        this.error = error;
        this.readableCurrentTime = readableCurrentTime;
        this.readableDuration = readableDuration;
    }
}
