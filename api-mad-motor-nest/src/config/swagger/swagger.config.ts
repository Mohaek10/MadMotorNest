import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Proyecto MadMotor API Rest')
    .setDescription(
      'API Rest para el proyecto MadMotor de la clase de Entornos de Servidor',
    )
    .setContact('MadMotor', 'madmotor.org', 'madmotorvives@madmotor.es')
    .setVersion('1.0')
    .addTag('vehiculos', 'Gestionar vehículos')
    .addTag('categorias', 'Categorías de vehículos')
    .addTag('clientes', 'Clientes y usuarios')
    .addTag('storage', 'Almacenamiento de archivos')
    .addTag('pieza', 'Piezas y repuestos')
    .addTag('pedidos', 'Pedidos y facturación')
    .addTag('auth', 'Autenticación y autorización')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
}
