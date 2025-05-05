import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'La api de VetAPPointment está funcionando! \n\n' +
      'Puedes acceder a la documentación de la openAPI UI con Swagger en: \n' +
      'http://localhost:3000/api-docs#/ \n\n' 
      

  }
}
