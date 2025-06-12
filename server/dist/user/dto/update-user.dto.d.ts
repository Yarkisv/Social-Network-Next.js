import { CreateUserDto } from "./create-user.dto";
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    fullname?: string | undefined;
    username: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    description?: string | undefined;
}
export {};
