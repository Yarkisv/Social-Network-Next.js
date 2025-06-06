import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { ChatMembersModule } from "./chat-members/chat-members.module";
import { MessagesModule } from "./messages/messages.module";
import { PostModule } from "./post/post.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServise: ConfigService) => ({
        type: "mysql",
        host: configServise.get("DB_HOST"),
        port: configServise.get("DB_PORT"),
        username: configServise.get("DB_USER"),
        password: configServise.get("DB_PASSWORD"),
        database: configServise.get("DB_NAME"),
        entities: [__dirname + "/**/*.entity{.js, .ts}"],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ChatModule,
    ChatMembersModule,
    MessagesModule,
    PostModule,
  ],
})
export class AppModule {}
