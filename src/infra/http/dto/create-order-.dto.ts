import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  recipient_id: string;

  @IsString()
  @IsNotEmpty()
  traking_code: string;
}
