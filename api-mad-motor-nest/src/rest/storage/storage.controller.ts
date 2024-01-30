import { Controller, Get, Param, Logger, Res } from '@nestjs/common'
import { Response } from 'express'
import { StorageService } from './storage.service'

@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name)

  constructor(private readonly storageService: StorageService) {}

  @Get(':nombreFich')
  async obtenerFichero(
    @Param('nombreFich') nombreFich: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Obteniendo fichero ${nombreFich}`)
    const fichero = this.storageService.encontrarFichero(nombreFich)
    this.logger.log(`Fichero obtenido ${nombreFich}`)
    res.sendFile(await fichero)
  }

  @Get()
  async obtenerTodosLosFicheros() {
    this.logger.log(`Obteniendo todos los ficheros con sus urls`)
    return await this.storageService.obtenerTodasLasImagenesConUrls()
  }
}
