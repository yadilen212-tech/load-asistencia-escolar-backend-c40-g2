import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, BadRequestException } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors
          .map((error) => {
            const constraints = error.constraints || {}
            return Object.values(constraints)
          })
          .flat()
        return new BadRequestException({
          statusCode: 400,
          message: messages.length > 0 ? messages : 'Validation failed',
          error: 'Bad Request',
        })
      },
    }),
  )

  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
