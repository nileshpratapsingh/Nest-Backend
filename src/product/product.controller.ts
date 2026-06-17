import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Query } from '@nestjs/common';
import mongoose from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('add_product')
    addProduct(@Body() createProductDto: CreateProductDto) {
        return this.productService.addProduct(createProductDto);
    }

    @Get()
    getAllProducts(@Param('page') page:number){
        return this.productService.findAll(page);
    }

    @Get()
    queryFind(@Query() query:any){
        return this.productService.findByQuery(query);
    }

    @Patch("update/:id")
    updateProduct(
        @Param('id') id:mongoose.Types.ObjectId,
        @Body() updateProductDto:UpdateProductDto
    ){
        return this.productService.updateProduct(id,updateProductDto)
    }

    @Delete('delete/:id')
    removeProduct(@Param('id') id:mongoose.Types.ObjectId){
        return this.productService.removeProduct(id);
    }
}
