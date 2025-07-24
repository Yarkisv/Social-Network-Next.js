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
    checkToken(req: any): Promise<{
        message: string;
    }>;
    logout(req: any, response: Response): Promise<Response<any, Record<string, any>>>;
    refreshTokens(req: any, response: Response): Promise<void>;
}
