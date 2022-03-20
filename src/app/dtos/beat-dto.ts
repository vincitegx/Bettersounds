import { BeatKey } from "../models/beat-key";
import { ContributingCreators } from "../models/contributing-creators";
import { Genre } from "../models/genre";
import { Mood } from "../models/mood";
import { PurchaseFile } from "../models/purchase-file";
import { Userinfo } from "./userinfo";

export interface BeatDto {

    id?: number;
    name:string;
    priceMp3:number;
    priceWav:number;
    tempo:number;
    uri?:string;
    artWork?:string;
    description:string;
    beatKey: BeatKey;
    mood: Mood;
    genre:Genre[];
    mainCreator?:string;
    contributingCreators?: ContributingCreators[];
    purchaseFile?:PurchaseFile;
    postedDate?: Date;
    modifiedDate?: Date;
}
