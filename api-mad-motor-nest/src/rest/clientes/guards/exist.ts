import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { ClientesService } from '../clientes.service'

@Injectable()
export class Exist implements CanActivate {
  constructor(private readonly _clienteService: ClientesService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const dni = request.params.dni
    return this._clienteService.searchByDni(dni).then((exists) => {
      if (!exists) {
        throw new BadRequestException('El cliente no existe')
      }
      return true
    })
  }
}
