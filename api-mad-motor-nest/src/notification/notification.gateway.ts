import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { Notificacion } from './model/notification.model'
import { VehiculoNotificationDto } from './dto/vehiculo-notification.dto'
const ENDPOINT: string = `/ws/${process.env.API_VERSION || 'v1'}/vehiculos`
@WebSocketGateway({ namespace: ENDPOINT })
export class NotificationGateway {
  @WebSocketServer()
  private server: Server
  private readonly logger = new Logger(NotificationGateway.name)
  constructor() {
    this.logger.log(`Vehiculos esta escuchando en WS: ${ENDPOINT}`)
  }
  sendMessage(notification: Notificacion<VehiculoNotificationDto>) {
    this.server.emit('updates', notification)
  }
  private handleConnection(client: Socket) {
    this.logger.debug('Cliente conectado:', client.id)
    this.server.emit(
      'connection',
      'Updates Notifications WS: Vehiculos - Connected',
    )
  }
  private handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id)
    this.logger.debug('Cliente desconectado:', client.id)
  }
}
