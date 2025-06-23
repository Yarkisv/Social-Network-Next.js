"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_module_1 = require("../user/user.module");
const jwt_1 = require("@nestjs/jwt");
const accessToken_strategy_1 = require("./strategies/accessToken.strategy");
const refreshToken_strategy_1 = require("./strategies/refreshToken.strategy");
const auth_guard_1 = require("./guards/auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            accessToken_strategy_1.AccessTokenStrategy,
            refreshToken_strategy_1.RefreshTokenStrategy,
            auth_guard_1.AuthGuard,
        ],
        imports: [user_module_1.UserModule, jwt_1.JwtModule.register({})],
        exports: [auth_guard_1.AuthGuard, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map