import { Cart } from "./cart";
import { Users } from "./users";

export class Order {
    id?: number;
    orderDate?: Date;
    orderStatus?: String;
    orderTotal: number;
    cart: Cart;
    user: Users;
    orderStatement: String;
    constructor(id?: number,orderDate?: Date,orderStatus?: String,orderTotal?: number,cart?: Cart,user?: Users, orderStatement?: String){}
}
