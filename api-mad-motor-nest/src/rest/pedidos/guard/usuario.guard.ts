import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { PedidosService } from '../pedidos.service'
import { Observable } from 'rxjs'

@Injectable()
export class UsuarioGuard implements CanActivate {
  constructor(private readonly pedidosService: PedidosService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const body = request.body
    const idUsuario = body.idUsuario

    if (!idUsuario) {
      throw new BadRequestException('El pedido debe tener un usuario asociado')
    }

    if (isNaN(idUsuario)) {
      throw new BadRequestException('El idUsuario debe ser un número')
    }

    return this.pedidosService.userExists(idUsuario).then((exists) => {
      if (!exists) {
        throw new BadRequestException('El usuario asociado al pedido no existe')
      }
      return true
    })
  }
}
