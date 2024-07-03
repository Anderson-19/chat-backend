import { User } from "../entities/user-authentication.entity";

export interface LoginResponse {
    user: User;
    token?: string;
}