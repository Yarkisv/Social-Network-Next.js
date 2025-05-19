import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/create-auth.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    } | undefined>;
}
