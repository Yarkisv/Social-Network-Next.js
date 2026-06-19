import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "src/comment/entities/comment.entity";
import { Like } from "src/like/entities/like.entity";
import { PostImage } from "src/post-image/entities/post-image.entity";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  post_id!: number;

  @OneToMany(() => PostImage, (image) => image.post, { cascade: true })
  images!: PostImage[];

  @Column({ default: "" })
  post_title!: string;

  @Column({ type: "json" })
  aiTags!: string[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @ManyToOne(() => User, (user) => user.posts)
  user!: User;

  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];

  @CreateDateColumn()
  created_at!: Date;
}
