import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Permitir solicitudes desde cualquier origen
    },
  })
  export class NotificacionesGateway {
    @WebSocketServer()
    server: Server;
  
    enviarNotificacion(evento: string, payload: any) {
      console.log(`Enviando notificación a evento: ${evento}`, payload); // Imprime en consola
      this.server.emit(evento, payload); // Emitir a todos los clientes
    }
  
    @SubscribeMessage('mensaje')
    handleMessage(@MessageBody() data: string): string {
      return `Mensaje recibido: ${data}`;
    }
  }
  