import { BeatKey } from "./beat-key";
import { ContributingCreators } from "./contributing-creators";
import { Genre } from "./genre";
import { Mood } from "./mood";
import { PurchaseFile } from "./purchase-file";
import { StreamState } from "./stream-state";

export class Beat {

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
    genre:Genre;
    // mainCreator?:string;
    // contributingCreators?: ContributingCreators[];
    purchaseFile?:PurchaseFile;
    // free?:boolean;
    postedDate?: Date;
    // modifiedDate?: Date;
    streamState?: StreamState;
}
