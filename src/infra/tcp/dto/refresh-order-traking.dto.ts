import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshOrderTrakingDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;
}
