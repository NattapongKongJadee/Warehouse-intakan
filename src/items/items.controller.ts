import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './items.entities';
import { CreateItemDto } from './itemsDto/createItemDto';
import { ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateItemDto } from './itemsDto/upteItemDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadItemImageDto } from './itemsDto/upload-item-image.dto';
import { FindItemsQueryDto } from './itemsDto/fintItemQueryDto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
  @Get()
  async findAll(@Query() query: FindItemsQueryDto) {
    return this.itemsService.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 99,
      name: query.name,
    });
  }

  @Get(':key')
  async findByKey(@Param('key') key: string): Promise<Item | Item[]> {
    const numericId = Number(key);

    if (!isNaN(numericId)) {
      return this.itemsService.findOne(numericId);
    }

    return this.itemsService.findAllByName(key); // <- return array
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  async update(
    @Param('id') id: number,
    @Body() updateData: UpdateItemDto,
  ): Promise<Item> {
    return this.itemsService.update(id, updateData);
  }

  @Put(':id/quantity')
  async updateItemQuantity(
    @Param('id') id: number,
    @Body() updateData: { transferQuantity: number; isAdd: boolean },
  ) {
    const updatedItem = await this.itemsService.updateQuantity(
      id,
      updateData.transferQuantity,
      updateData.isAdd,
    );
    return { message: 'Quantity updated successfully', updatedItem };
  }

  @Post()
  @ApiOperation({ summary: 'Create an item with an optional image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() itemData: CreateItemDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    return this.itemsService.create(itemData, file);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Upload an image for an item' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @Body() _uploadDto: UploadItemImageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.itemsService.uploadImage(file, Number(id));
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    return this.itemsService.delete(id);
  }
}
