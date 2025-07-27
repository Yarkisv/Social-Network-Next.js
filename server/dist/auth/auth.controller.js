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
const post_service_1 = require("../post/post.service");
const subscription_service_1 = require("../subscription/subscription.service");
let AuthController = class AuthController {
    authService;
    userService;
    postService;
    subscriptionService;
    constructor(authService, userService, postService, subscriptionService) {
        this.authService = authService;
        this.userService = userService;
        this.postService = postService;
        this.subscriptionService = subscriptionService;
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
    async me(req) {
        const id = req.user.user_id;
        console.log("User id: ", id);
        const user = await this.userService.findBasicDataById(id);
        console.log(user);
        return user;
    }
    async getFullUserData(username) {
        const user = await this.userService.findByUsername(username);
        const posts = await this.postService.findUserPostsById(user.user_id);
        const { subscriptions, subscribers } = await this.subscriptionService.findAllById(user.user_id);
        return { user, posts, subscriptions, subscribers };
    }
    async checkToken(req) {
        const token = req.user.token;
        if (!token) {
            throw new common_1.UnauthorizedException("Not authorized");
        }
        return { message: "Token valid" };
    }
    async logout(req, response) {
        const token = req.user.token;
        if (!token) {
            throw new common_1.UnauthorizedException("Not authorized");
        }
        response.clearCookie("access_token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        response.clearCookie("refresh_token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        return response.status(200).json({ message: "Logout successful" });
    }
    async refreshTokens(req, response) {
        const refreshToken = req.user.token;
        console.log("Refresh token from request: ", refreshToken);
        const { access_token, refresh_token } = await this.authService.refreshTokens(refreshToken);
        console.log(`New access token: [${access_token}]\n New refresh token : [${refresh_token}]`);
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
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Get)("get-full/:username"),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getFullUserData", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("/check-token"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkToken", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("logout"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(refreshToken_guard_1.RefreshTokenGuard),
    (0, common_1.Get)("refresh"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        post_service_1.PostService,
        subscription_service_1.SubscriptionService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map