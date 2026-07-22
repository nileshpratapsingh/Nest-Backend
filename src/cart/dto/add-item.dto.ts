// dto/add-item.dto.ts
import { IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class AddItemDto {
  @IsMongoId()
  productId!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number = 1;
}
