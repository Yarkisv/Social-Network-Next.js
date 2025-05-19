import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
    } | undefined>;
}
