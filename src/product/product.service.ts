import mongoose, { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { TokenUtility } from '@utils/token.utility';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '@schemas/product.schema';
import { CloudinaryUploadResult } from '@middlewares/image-upload/image-upload.middleware';

@Injectable()
export class ProductService {
    constructor(
        // private readonly tokenUtility:TokenUtility,
        @InjectModel(Product.name) private productModel:Model<ProductDocument>
    ){}

    async addProduct(
        createProductDto: CreateProductDto,
        file?: CloudinaryUploadResult,
    ): Promise<{ message: string; product: Product }> {
        try {
            const productData: Partial<Product> = {
                title: createProductDto.title.trim(),
                category: createProductDto.category?.map((cat) =>
                    cat.trim().toLowerCase(),
                ),
                subCategory: createProductDto.subCategory?.map((subCat) =>
                    subCat.trim().toLowerCase(),
                ),
                rating: createProductDto.rating,
                price: createProductDto.price,
                description: createProductDto.description,
                features: createProductDto.features,
                specs: createProductDto.specs,
                reviews: createProductDto.reviews,
                outOfStock: createProductDto.outOfStock,
                qa: createProductDto.qa,
                sale: createProductDto.sale,
                quantity: createProductDto.quantity,
            };

            if (file) {
                productData.productImage = file.secureUrl;
            }

            const newProduct = await this.productModel.create(productData);

            return {
                message: 'Product Added successfully',
                product: newProduct,
            };
        } catch (error) {
            console.error('Create Product service error:', error);
            throw error;
        }
    }

    async findAll(page:number):Promise<{
        pages:number,product:Product[]
    }> {
        const limit = 20;
        const totalProduct:number = await this.productModel.countDocuments();
        const pages:number = totalProduct / limit;
        const skip = (page - 1) * limit;
        const products = await this.productModel.find().skip(skip).limit(limit).exec();
        return {
            pages:pages,
            product:products
        };
    }

    async findByQuery(query:any):Promise<{
        result:Product[],totalPage:number
    }> {
        const { page, limit, category, subCategory } = query;
        const skip:number = (page - 1) * limit;
        const productListOne:Product[] = await this.productModel.find({
            category:category.trim()
        }).limit(limit).skip(skip).exec();
        const productListTwo:Product[] = await this.productModel.find({
            subCategory:subCategory.trim()
        }).limit(limit).skip(skip).exec();
        const collection :Product[]=[...productListOne,...productListTwo];
        const totalPage:number = (collection.length/limit);
        return {
            result:collection,
            totalPage:totalPage
        };
    }

    async updateProduct(
        id:mongoose.Types.ObjectId,
        updateProductDto: UpdateProductDto
    ):Promise<Product>{
        const productData:Partial<Product> = updateProductDto;
        const updatedProduct = await this.productModel.findByIdAndUpdate(id,productData,{
            new:true,
        });
        if(!updatedProduct) throw new Error("Product cannot be updated!!")
        return updatedProduct;
    }

    async toggleStock(id: mongoose.Types.ObjectId) :Promise<Product | null>{
        const product = await this.productModel.findById(id);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return await this.productModel.findByIdAndUpdate(
            id,
            { outOfStock: !product.outOfStock, },
            { 
                new: true,
                runValidators: true,
            },
        );
    }

    async removeProduct(id:mongoose.Types.ObjectId):Promise<void | null>{
        return await this.productModel.findByIdAndDelete(id);
    }
}
