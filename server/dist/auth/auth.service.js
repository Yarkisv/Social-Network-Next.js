"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
let AuthService = class AuthService {
    userService;
    jwtService;
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        try {
            const email = loginDto.email;
            const password = loginDto.password;
            const user = await this.userService.findOne(email);
            console.log("User:", user);
            if (!user) {
                throw new common_1.UnauthorizedException("User not found");
            }
            const isPassMatch = await argon2.verify(user.password, password);
            if (!isPassMatch) {
                throw new common_1.UnauthorizedException("Invalid password");
            }
            const tokens = await this.getTokens(user.user_id, user.username, user.email);
            return tokens;
        }
        catch (err) {
            console.error("Login error:", err);
            throw new common_1.UnauthorizedException("Login failed");
        }
    }
    async refreshTokens(refreshToken) {
        const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: REFRESH_JWT_SECRET,
            });
            const user_id = payload.user_id;
            const username = payload.username;
            const email = payload.email;
            const user = await this.userService.findFullDataById(user_id);
            if (!user)
                throw new common_1.ForbiddenException("Access Denied");
            const { access_token, refresh_token } = await this.getTokens(user_id, username, email);
            return { access_token, refresh_token };
        }
        catch (err) {
            throw new common_1.ForbiddenException(`Access Denied: ${err}`);
        }
    }
    async getTokens(user_id, username, email) {
        const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
        const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
        const payload = {
            user_id,
            username,
            email,
        };
        const [access_token, refresh_token] = await Promise.all([
            await this.jwtService.signAsync(payload, {
                secret: ACCESS_JWT_SECRET,
                expiresIn: "1h",
            }),
            await this.jwtService.signAsync(payload, {
                secret: REFRESH_JWT_SECRET,
                expiresIn: "7d",
            }),
        ]);
        return {
            access_token,
            refresh_token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map