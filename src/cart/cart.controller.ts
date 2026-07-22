import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { LoginProtectedGuard } from '@guards/login-protected/login-protected.guard';

@UseGuards(LoginProtectedGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post('save_cart')
    create(@Body() createCartDto: CreateCartDto) {
        return this.cartService.saveCart(createCartDto);
    }

    @Get(':cartId')
    findCart(
        @Body() updateCartDto: UpdateCartDto
    ) {
        return this.cartService.getCart(updateCartDto);
    }

    @Patch('alter_quantity')
    alterQuantity(
        @Body('productId') productId: string,
        @Body('quantity') newQuantity: number,
        @Body() updateCartDto: UpdateCartDto,
    ) {
        return this.cartService.alterQuantity(productId, newQuantity, updateCartDto);
    }

    @Delete(':productId')
    remove(
        @Param('productId') productId: string,
        @Body() updateCartDto: UpdateCartDto) {
        return this.cartService.removeItem(productId, updateCartDto);
    }
}
