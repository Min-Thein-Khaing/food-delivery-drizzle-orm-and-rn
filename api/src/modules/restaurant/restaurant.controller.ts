import { Controller, UseGuards, Post, Body, Get, Param, Query, Patch } from '@nestjs/common';
import { RestaurantService } from './providers/restaurant.service.js';
import { JwtTokenGuard } from '../auth/guard/jwt-token.guard.js';
import { RolesGuard } from '../auth/guard/role.guard.js';
import { Roles } from '../auth/role/role.decorator.js';
import { UserRole } from '../../types/index.js';
import { CreateRestaurantDto } from './dto/createRestaurant.dto.js';
import type { FindAllQuery } from './interface/restaurant.interface.js';
import { GetUser } from '../../common/guard/getRole.guard.js';
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto.js';



@Controller('restaurant')
@UseGuards(JwtTokenGuard)
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService
    ) {}

   @Post()
   @UseGuards(RolesGuard)
   @Roles(UserRole.RESTAURANT_OWNER)
   async create (@GetUser('id') ownerId: string, @Body() createRestaurantDto: CreateRestaurantDto) {
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

   @Patch("/:id")
   @UseGuards(RolesGuard)
   @Roles(UserRole.RESTAURANT_OWNER)
   async update(@Param("id") id: string, @GetUser('id') ownerId: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.updateRestaurant(id, ownerId, updateRestaurantDto);
   }
}
