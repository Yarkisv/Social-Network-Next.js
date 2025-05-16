import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  fullname: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;
}
