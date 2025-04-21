import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { Item } from './items.entities';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ItemsService {
  private storage = new Storage({
    projectId: 'intakan-company',
  });

  private bucketName = 'intakan-image-db';

  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async findAll(options: { page: number; limit: number; name?: string }) {
    const { page, limit, name } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (name) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.name = Like(`%${name}%`);
    }

    const [items, total] = await this.itemsRepository.findAndCount({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      take: limit,
      skip,
      order: { id: 'ASC' },
    });

    return {
      data: items,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Item> {
    const numericId = Number(id);
    const item = await this.itemsRepository.findOneBy({
      id: numericId,
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not Found`);
    }
    return item;
  }
  async findAllByName(name: string): Promise<Item[]> {
    const items = await this.itemsRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });

    if (!items.length) {
      throw new NotFoundException(
        `No items found with name containing "${name}"`,
      );
    }

    return items;
  }

  async create(
    itemData: Partial<Item>,
    file?: Express.Multer.File,
  ): Promise<Item> {
    let imageUrl: string | undefined = file
      ? await this.uploadImageToStorage(file)
      : undefined;

    if (file) {
      imageUrl = await this.uploadImageToStorage(file);
      console.log(imageUrl);
    }

    // 🔥 Create new item, storing image URL if uploaded
    const item = this.itemsRepository.create({
      ...itemData,
      imageUrl, // ✅ Save image URL if uploaded
    });

    return this.itemsRepository.save(item);
  }

  private async uploadImageToStorage(
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const fileName = `items/${uuidv4()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    } catch (e) {
      console.error('❌ Upload to GCS failed:', e);
      throw new Error(`Image upload failed: ${e}`);
    }
  }

  async update(id: number, updateData: Partial<Item>): Promise<Item> {
    const item = await this.itemsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    Object.assign(item, updateData);
    return this.itemsRepository.save(item);
  }

  async updateQuantity(
    itemId: number,
    transferQuantity: number,
    isAdd: boolean = false,
  ) {
    const item = await this.itemsRepository.findOne({ where: { id: itemId } });
    if (!item) throw new Error('Item not found');

    const updatedQuantity = isAdd
      ? item.quantity + transferQuantity
      : Math.max(0, item.quantity - transferQuantity);

    await this.itemsRepository.update(itemId, { quantity: updatedQuantity });
    return this.itemsRepository.findOne({ where: { id: itemId } });
  }

  async delete(id: number): Promise<{ message: string }> {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    await this.itemsRepository.remove(item);
    return { message: `Item with ID ${id} deleted successfully` };
  }

  async uploadImage(
    file: Express.Multer.File,
    itemId: number,
  ): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const fileName = `items/${uuidv4()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;

      await this.itemsRepository.update(itemId, { imageUrl: publicUrl });

      return publicUrl;
    } catch (e) {
      throw new Error(`Image upload failed : ${e}`);
    }
  }
}
