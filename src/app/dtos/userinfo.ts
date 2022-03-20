import { Roles } from "../models/roles";

export interface Userinfo {

    id: number;
    name: string;
    email: string;
    imageUrl: string;
    userRoles: Set<Roles>;

}
