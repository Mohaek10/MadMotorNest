import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { ValidationPipe } from '@nestjs/common'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { setupSwagger } from './config/swagger/swagger.config'

dotenv.config(
  process.env.NODE_ENV === 'dev' ? { path: '.env' } : { path: '.env.prod' },
)
async function bootstrap() {
  if (process.env.NODE_ENV === 'dev') {
    console.log('🚧 Modo de desarrollo activado 🚧')
  } else {
    console.log('🚀 Modo de producción activado 🚀')
  }

  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  }
  const app = await NestFactory.create(AppModule, { httpsOptions })

  if (process.env.NODE_ENV === 'dev') {
    setupSwagger(app)
  }

  app.setGlobalPrefix(process.env.API_VERSION || 'v1')

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.API_PORT || 3000)
}
bootstrap().then(() =>
  console.log(
    `🚗💨 Motor en marcha en el puerto: ${
      process.env.API_PORT || 3000
    } y perfil: ${process.env.NODE_ENV} 🏁🏆`,
  ),
)
