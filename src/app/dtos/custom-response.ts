import { Beat } from "../models/beat";
import { BeatKey } from "../models/beat-key";
import { CartItem } from "../models/cart-item";
import { Genre } from "../models/genre";
import { Mood } from "../models/mood";
import { Order } from "../models/order";
import { Loginresponsepayload } from "./loginresponsepayload";

export interface CustomResponse{
    timeStamp: Date;
    statusCode:number;
    status:string;
    reason:string;
    message:string;
    developerMessage:string;
    data: { beats?:Beat[], beat?:Beat,orders:Order[], order: Order, genres?:Genre[],
         genre?:Genre, beatKeys?:BeatKey[],beatKey?:BeatKey,
        moods?:Mood[], mood?:Mood, taskStatus?:boolean, cartItem?:CartItem, cartItems?:CartItem[],
        JwtResponse?:Loginresponsepayload};
}