import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Express } from 'express';

export class UploadItemImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The image file to upload',
  })
  @IsNotEmpty()
  file: Express.Multer.File;
}
