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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_auth_dto_1 = require("./dto/create-auth.dto");
const auth_guard_1 = require("./guards/auth.guard");
const user_service_1 = require("../user/user.service");
const refreshToken_guard_1 = require("./guards/refreshToken.guard");
let AuthController = class AuthController {
    authService;
    userServise;
    constructor(authService, userServise) {
        this.authService = authService;
        this.userServise = userServise;
    }
    async login(loginDto, response) {
        const { access_token, refresh_token } = await this.authService.login(loginDto);
        response.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });
        response.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { message: "Login successful" };
    }
    profile(req) {
        const id = req.user.user_id;
        return this.userServise.findById(id);
    }
    refreshTokens(req) {
        const refreshToken = req.user.token;
        return this.authService.refreshTokens(refreshToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "profile", null);
__decorate([
    (0, common_1.UseGuards)(refreshToken_guard_1.RefreshTokenGuard),
    (0, common_1.Get)("refresh"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshTokens", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map