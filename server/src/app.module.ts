import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { ChatMembersModule } from "./chat-members/chat-members.module";
import { MessagesModule } from "./messages/messages.module";
import { PostModule } from "./post/post.module";
import { CommentModule } from "./comment/comment.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { LikeModule } from "./like/like.module";
import { dataSourceOptions } from "db/data-source";
import { ConfigModule } from "@nestjs/config";
import { PostImageModule } from "./post-image/post-image.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "static"),
      serveRoot: "/static",
    }),
    UserModule,
    AuthModule,
    ChatModule,
    ChatMembersModule,
    MessagesModule,
    PostModule,
    CommentModule,
    SubscriptionModule,
    LikeModule,
    PostImageModule,
  ],
})
export class AppModule {}
