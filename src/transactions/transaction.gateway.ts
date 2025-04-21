import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Transaction } from './transactions.entities';

@WebSocketGateway({
  cors: {
    origin: '*', // หรือระบุ frontend origin
  },
})
export class TransactionGateway {
  @WebSocketServer()
  server: Server;

  emitTransactionCreated(transaction: Transaction) {
    console.log('📡 Emitting transactionCreated event:', transaction); // ✅ log ตรงนี้
    this.server.emit('transactionCreated', transaction);
  }
}
