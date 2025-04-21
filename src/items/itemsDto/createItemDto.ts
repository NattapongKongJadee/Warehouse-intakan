import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Industrial Air Handling Unit' })
  name: string;

  @ApiProperty({ example: 'HVAC' })
  category: string;
  @ApiPropertyOptional({
    example: JSON.stringify({
      capacity: '5000 CFM',
      power_supply: '380V/50Hz',
      brand: 'Trane',
      type: 'Rooftop Unit',
    }),
    description: 'Optional specifications in JSON string format',
    type: 'string',
  })
  specs?: string;

  @ApiProperty({ example: 'set' })
  unit: string;

  @ApiProperty({ example: 5 })
  quantity: number;

  @ApiProperty({ example: 'Warehouse C2' })
  location: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Optional image file',
  })
  file?: any;
}
