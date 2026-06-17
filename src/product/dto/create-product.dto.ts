import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ReviewDto {
    @IsString()
    name!: string;

    @IsString()
    comment!: string;
}

class QADto {
    @IsString()
    question!: string;

    @IsString()
    answer!: string;
}

export class CreateProductDto {

    @IsString()
    title!: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    category?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subCategory?: string[];

    @IsNumber()
    @Min(0)
    @Max(5)
    rating!: number;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsOptional()
    @IsString()
    productImage?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    features?: string[];

    @IsOptional()
    specs?: Record<string, string>;

    @IsOptional()
    @IsString()
    shipping?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReviewDto)
    reviews?: ReviewDto[];

    @IsOptional()
    @IsBoolean()
    outOfStock?: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QADto)
    qa?: QADto[];

    @IsOptional()
    @IsNumber()
    @Min(0)
    sale?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    quantity?: number;
}
