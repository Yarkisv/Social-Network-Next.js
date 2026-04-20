import { Post } from "src/post/entities/post.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity("post_images")
export class PostImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  path_to!: string;

  @ManyToOne(() => Post, (post) => post.images)
  post!: Post;
}
