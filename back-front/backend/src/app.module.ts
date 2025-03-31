import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VeterinariaModule } from './veterinaria/veterinaria.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DBURI as string),
    VeterinariaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
