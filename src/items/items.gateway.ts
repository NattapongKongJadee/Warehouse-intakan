/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ItemsService } from './items.service';
import { CreateItemDto } from './itemsDto/createItemDto';
import { UpdateItemDto } from './itemsDto/upteItemDto';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ItemGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly itemsService: ItemsService) {}

  @SubscribeMessage('createItem')
  async handleCreateItem(client, createItemDto: CreateItemDto) {
    const item = await this.itemsService.create(createItemDto, undefined);
    console.log('📡 Emitting itemCreated:', item); // ✅ Debugging log
    this.server.emit('itemCreated', item);
  }

  @SubscribeMessage('updateItem')
  async handleUpdateItem(
    @MessageBody() updateData: UpdateItemDto & { id: number },
  ) {
    const { id, ...updateFields } = updateData;
    const updatedItem = await this.itemsService.update(id, updateFields);
    console.log('📡 Broadcasting itemUpdated event:', updatedItem);
    this.server.emit('itemUpdated', updatedItem);
  }

  // Inside your socket gateway or setup
  @SubscribeMessage('itemUpdated')
  async handleItemUpdated(
    @MessageBody() updateData: UpdateItemDto & { id: number },
  ): Promise<{ success: boolean; item?: any; error?: any }> {
    console.log('📥 Received itemUpdated from client:', updateData);

    try {
      const updatedItem = await this.itemsService.update(
        updateData.id,
        updateData,
      );
      this.server.emit('broadcastItemUpdate', updatedItem);

      return { success: true, item: updatedItem };
    } catch (error) {
      console.error('❌ Error updating item:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { success: false, error: error.message };
    }
  }
  @SubscribeMessage('deleteItem')
  async handleDeleteItem(
    @MessageBody() data: { id: number | string },
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const numericId = Number(data.id);

    try {
      // const item = await this.itemsService.findOne(numericId);
      await this.itemsService.delete(numericId);

      this.server.emit('itemDeleted', { id: numericId });

      return { success: true, message: `Item ${numericId} deleted.` };
    } catch (error) {
      console.error('❌ Error deleting item:', error);
      return { success: false, error: error.message };
    }
  }
}
