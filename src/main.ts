import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import 'dotenv/config';

declare const module: {
  hot?: {
    accept(): void;
    dispose(callback: () => void): void;
  };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.LOCAL_DOMAIN, 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  setupSwagger(app);

  await app.listen(process.env.API_PORT || 8000);

  module.hot?.accept();
  module.hot?.dispose(() => {
    void app.close();
  });
}

void bootstrap();
