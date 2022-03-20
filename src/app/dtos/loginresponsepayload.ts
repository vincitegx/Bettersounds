import { Userinfo } from "./userinfo";

export interface Loginresponsepayload {
    authenticationToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    user?: Userinfo;
}
