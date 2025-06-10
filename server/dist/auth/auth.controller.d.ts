import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/create-auth.dto";
import { UserService } from "src/user/user.service";
import { Response } from "express";
export declare class AuthController {
    private readonly authService;
    private readonly userServise;
    constructor(authService: AuthService, userServise: UserService);
    login(loginDto: LoginDto, response: Response): Promise<{
        message: string;
    }>;
    profile(req: any): Promise<any>;
    refreshTokens(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
