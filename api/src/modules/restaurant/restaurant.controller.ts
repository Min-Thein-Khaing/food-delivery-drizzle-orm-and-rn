import { Controller, UseGuards, Post, Req, Body, Get, Param, Query } from '@nestjs/common';
import { RestaurantService } from './providers/restaurant.service.js';
import { JwtTokenGuard } from '../auth/guard/jwt-token.guard.js';
import { RolesGuard } from '../auth/guard/role.guard.js';
import { Roles } from '../auth/role/role.decorator.js';
import { UserRole } from '../../types/index.js';
import { CreateRestaurantDto } from './dto/createRestaurant.dto.js';
import type { FindAllQuery } from './interface/restaurant.interface.js';
import { GetUser } from '../../common/guard/getRole.guard.js';



@Controller('restaurant')
@UseGuards(JwtTokenGuard)
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService
    ) {}

   @Post()
   @UseGuards(RolesGuard)
   @Roles(UserRole.RESTAURANT_OWNER)
   async create (@Req()  ownerId: string, @Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(ownerId, createRestaurantDto);
   }

   @Get("/mine")
   @UseGuards(RolesGuard)
   @Roles(UserRole.RESTAURANT_OWNER)
   async findMine(@GetUser('id') id: string) {
    return this.restaurantService.findMine(id);
   }

   @Get()
   async findAll(@Query() query: FindAllQuery) {
    return this.restaurantService.findAll(query);
   }

   @Get("/:id")
   async findById(@Param("id") id: string) {
    return this.restaurantService.findById(id);
   }
}
