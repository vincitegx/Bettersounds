import { Userinfo } from "../dtos/userinfo";
import { CartItem } from "./cart-item";
import { Users } from "./users";

export class Cart {

    id?: number;
    grandTotal: number;
    cartItems: CartItem[];
    user?: Userinfo;
    constructor(id?:number, grandTotal?:number, cartItems?:CartItem[],user?:Userinfo){
        this.id = id;
        this.grandTotal = grandTotal;
        this.cartItems = cartItems;
        this.user = user;
    }
}
