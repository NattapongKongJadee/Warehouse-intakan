import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty({ example: 1, description: 'Item ID to link with stock' })
  itemId: number;

  @ApiProperty({ example: 100, description: 'Quantity of the item in stock' })
  quantity: number;

  @ApiProperty({
    example: 'Main Warehouse',
    description: 'Location of stock',
    required: false,
  })
  warehouseLocation?: string;
}
