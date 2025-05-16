import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';

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
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {}
