import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../../common/guard/getRole.guard.js';
import { UserRole } from '../../types/index.js';
import { JwtTokenGuard } from '../auth/guard/jwt-token.guard.js';
import { RolesGuard } from '../auth/guard/role.guard.js';
import { Roles } from '../auth/role/role.decorator.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { CreateMenuItemDto } from './dto/create-menu-item.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { MenuService } from './providers/menu.service.js';

@Controller('menu')
@UseGuards(JwtTokenGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  createCategory(
    @GetUser('id') ownerId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.menuService.createCategory(ownerId, createCategoryDto);
  }

  @Get('restaurants/:restaurantId')
  getCategories(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getCategories(restaurantId);
  }

  @Patch('categories/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  updateCategory(
    @Param('id') id: string,
    @Param('restaurantId') restaurantId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.menuService.update(id, restaurantId, updateCategoryDto);
  }

  @Delete('categories/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  deleteCategory(
    @Param('id') id: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.menuService.delete(id, restaurantId);
  }

  @Post('items')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  createItem(
    @GetUser('id') ownerId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    return this.menuService.createItem(ownerId, createMenuItemDto);
  }

  @Get('restaurants/:restaurantId/items')
  getItems(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getItemsByRestaurant(restaurantId);
  }

  @Patch('items/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  updateItem(
    @Param('id') id: string,
    @Param('restaurantId') restaurantId: string,
    @Body() updateMenuItemDto: CreateMenuItemDto,
  ) {
    return this.menuService.updateItem(id, restaurantId, updateMenuItemDto);
  }

  @Delete('items/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  deleteItem(
    @Param('id') id: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.menuService.deleteItem(id, restaurantId);
  }
}
