import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/create-auth.dto";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getTokens(user_id: number, username: string, email: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
