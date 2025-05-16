import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<{
        user: {
            fullname: string;
            username: string;
            email: string;
            phone: string;
            password: string;
        } & User;
    }>;
}
