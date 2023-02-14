import { Cart } from "../models/cart";
import { Userinfo } from "./userinfo";

export interface OrderDto {
    id?: number;
    orderTotal: number;
    cart: Cart;
    userInfo?: Userinfo;
    orderStatement?: String;
}
