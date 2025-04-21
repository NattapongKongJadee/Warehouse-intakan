import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './createItemDto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty({ example: 'Updated Air Handling Unit', required: false })
  name?: string;

  @ApiProperty({ example: 'HVAC', required: false })
  category?: string;

  @ApiPropertyOptional({
    example: '{"brand":"Daikin","capacity":"6000 CFM"}',
    description: 'Specifications as JSON string',
  })
  specs?: string;

  @ApiProperty({ example: 'set', required: false })
  unit?: string;

  @ApiProperty({ example: 8, required: false })
  quantity?: number;

  @ApiProperty({ example: 'Warehouse D3', required: false })
  location?: string;
}
