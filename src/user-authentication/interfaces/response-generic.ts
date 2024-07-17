import { LoginResponse } from "./login-response";

export interface ResponseGeneric {
    status: number;
    message: string | string[];
    error: boolean;
    data?: LoginResponse;
}