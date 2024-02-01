import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class StorageService {
  private readonly fichero = process.env.filesDir || './uploads'
  private readonly logger = new Logger(StorageService.name)
  private readonly isDev = process.env.NODE_ENV === 'dev'

  async onModuleInit() {
    if (this.isDev) {
      if (fs.existsSync(this.fichero)) {
        this.logger.log(`Eliminando fichero ${this.fichero}`)
        fs.readdirSync(this.fichero).forEach((file) => {
          fs.unlinkSync(`${this.fichero}/${file}`)
        })
      }
    }
  }

  async obtenerTodasLasImagenesConUrls(): Promise<string[]> {
    this.logger.log(`Obteniendo todas las imágenes`)
    const version = process.env.API_VERSION ? `/${process.env.API_VERSION}` : ''
    const url = `${process.env.PROTOCOLO}://${process.env.HOST}${version}/storage/`
    const ficheros = fs.readdirSync(this.fichero)
    const ficherosConUrl = ficheros.map((fichero) => `${url}${fichero}`)
    this.logger.log(`Ficheros con url ${ficherosConUrl}`)
    return ficherosConUrl
  }
  encontrarFichero(nombreFich: string): string {
    this.logger.log(`Buscando fichero ${nombreFich}`)
    const fichero = path.join(process.cwd(), process.env.filesDir, nombreFich)
    if (fs.existsSync(fichero)) {
      this.logger.log(`Fichero encontrado ${nombreFich}`)
      return fichero
    } else {
      this.logger.log(`Fichero no encontrado ${nombreFich}`)
    }
  }
  borraFichero(nombreFich: string) {
    this.logger.log(`Borrando fichero ${nombreFich}`)
    const file = path.join(process.cwd(), process.env.filesDir, nombreFich)
    this.logger.log(`Fichero a borrar ${file}`)
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    } else {
      throw new NotFoundException(`Fichero ${nombreFich} no encontrado`)
    }
  }
}
