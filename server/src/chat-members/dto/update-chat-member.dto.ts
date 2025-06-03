import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMemberDto } from './create-chat-member.dto';

export class UpdateChatMemberDto extends PartialType(CreateChatMemberDto) {}
