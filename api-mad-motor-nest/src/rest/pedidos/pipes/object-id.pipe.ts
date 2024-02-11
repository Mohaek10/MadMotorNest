import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { ObjectId } from 'mongodb'
@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: any) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('El id proporcionado no es válido.')
    }
    return value
  }
}
