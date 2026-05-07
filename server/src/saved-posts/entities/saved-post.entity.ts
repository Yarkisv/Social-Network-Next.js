import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("saved_posts")
@Unique(["user", "post"])
export class SavedPost {
  @PrimaryGeneratedColumn()
  saved_post_id!: number;

  @ManyToOne(() => User, (user) => user.savedPosts, {
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Post, {
    onDelete: "CASCADE",
  })
  post!: Post;
}
