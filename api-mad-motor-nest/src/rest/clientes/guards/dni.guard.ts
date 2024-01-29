import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class DniGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const dni = request.params.dni

    const dniRegex = /^[0-9]{8}$/
    if (!dniRegex.test(dni)) {
      throw new BadRequestException(
        'El formato del dni no es valido , debe ser de 8 digitos y una letra al final',
      )
    }
    return true
  }
}
