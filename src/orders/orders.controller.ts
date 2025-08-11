import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { handleRpcError, PaginationDto } from 'src/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto).pipe(handleRpcError());
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto).pipe(handleRpcError());
  }

  @Get(':status')
  findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    return this.client
      .send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      })
      .pipe(handleRpcError());
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder', { id }).pipe(handleRpcError());
  }

  @Patch(':id')
  changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    return this.client
      .send('changeOrderStatus', { id, status: statusDto.status })
      .pipe(handleRpcError());
  }
}
