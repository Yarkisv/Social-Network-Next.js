import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostImageService } from './post-image.service';
import { CreatePostImageDto } from './dto/create-post-image.dto';
import { UpdatePostImageDto } from './dto/update-post-image.dto';

@Controller('post-image')
export class PostImageController {
  constructor(private readonly postImageService: PostImageService) {}

  @Post()
  create(@Body() createPostImageDto: CreatePostImageDto) {
    return this.postImageService.create(createPostImageDto);
  }

  @Get()
  findAll() {
    return this.postImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostImageDto: UpdatePostImageDto) {
    return this.postImageService.update(+id, updatePostImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postImageService.remove(+id);
  }
}
