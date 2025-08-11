import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { handleRpcError, PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProductDto).pipe(handleRpcError());
  }

  @Get()
  finAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_product' }, paginationDto).pipe(handleRpcError());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(handleRpcError());
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.client
      .send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(handleRpcError());
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(handleRpcError());
  }
}
