import { IsArray, IsInt, IsMongoId, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CartItemDto {
  @IsMongoId()
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateCartDto {
  @IsMongoId()
  @IsString()
  userId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  productIds!: CartItemDto[];
}
