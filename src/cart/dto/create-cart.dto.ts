import { IsArray, IsInt, IsMongoId, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CartItemDto {
  @IsMongoId()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateCartDto {
  @IsMongoId()
  userId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  productIds!: CartItemDto[];
}
