// src/app.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: { origin: '*' } })
  export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
  {
    @WebSocketServer() server: Server;
  
    afterInit() {
      console.log('✅ WebSocket Gateway inicializado');
    }
  
    handleConnection(client: Socket) {
      console.log(`🔌 Cliente WS conectado: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`❌ Cliente WS desconectado: ${client.id}`);
    }
  
    /** Método utilitario para emitir eventos desde cualquier servicio */
    emit<T = any>(channel: string, payload: T) {
      this.server.emit(channel, payload);
    }
  }
  