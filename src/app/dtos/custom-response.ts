import { Beat } from "../models/beat";
import { BeatKey } from "../models/beat-key";
import { Genre } from "../models/genre";
import { Mood } from "../models/mood";
import { Loginresponsepayload } from "./loginresponsepayload";

export interface CustomResponse{
    timeStamp: Date;
    statusCode:number;
    status:string;
    reason:string;
    message:string;
    developerMessage:string;
    data: { beats?:Beat[], beat?:Beat, genres?:Genre[],
         genre?:Genre, beatKeys?:BeatKey[],beatKey?:BeatKey,
        moods?:Mood[], mood?:Mood, taskStatus?:boolean,
        JwtResponse?:Loginresponsepayload};
}