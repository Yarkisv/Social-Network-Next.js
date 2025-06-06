import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/create-auth.dto";
import { UserService } from "src/user/user.service";
export declare class AuthController {
    private readonly authService;
    private readonly userServise;
    constructor(authService: AuthService, userServise: UserService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    } | undefined>;
    profile(req: any): Promise<import("../user/entities/user.entity").User | null>;
}
