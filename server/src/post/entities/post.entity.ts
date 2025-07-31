import { User } from "src/user/entities/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "src/comment/entities/comment.entity";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  contentPathTo: string;

  @Column({ default: "" })
  post_title: string;

  @Column({ default: 0 })
  likes: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
