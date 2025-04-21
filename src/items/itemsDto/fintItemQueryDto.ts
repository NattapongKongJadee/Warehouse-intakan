import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindItemsQueryDto {
  @ApiPropertyOptional({ description: 'ชื่อสินค้า (optional)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 99 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
