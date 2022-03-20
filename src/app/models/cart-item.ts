import { BeatDto } from "../dtos/beat-dto";
import { BeatType } from "../enum/beattype.enum";
import { Beat } from "./beat";

export class CartItem {
    id: number;
    qty: number;
    subTotal:number;
    beat: Beat;
    beatType?: BeatType;
    licenseUri?: string;

    constructor(){
        this.qty =1;
        // this.subTotal= this.quantity * this.beatDto.price; 
    }
    // public getSubTotal(beatType: BeatType):number{
    //     this.subTotal = 0;
    //     this.beatType = beatType;
    //     if(this.beatType == BeatType.mp3){
    //         this.subTotal = this.beat.priceMp3;
    //     }else{
    //         this.subTotal = this.beat.priceWav;
    //     }
    //     return this.subTotal;
    // }
}
