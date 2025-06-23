import { IsDate, IsNumber } from "class-validator";

export class CreateSubscriptionDto {
  @IsNumber()
  subscribeToId: number;

  @IsDate()
  currentDate: Date;
}
