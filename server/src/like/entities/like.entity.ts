import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("likes")
export class Like {
  @PrimaryGeneratedColumn()
  like_id: number;

  @ManyToOne(() => Post, (post) => post.post_id, { onDelete: "CASCADE" })
  post: Post;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: "CASCADE" })
  user: User;
}
