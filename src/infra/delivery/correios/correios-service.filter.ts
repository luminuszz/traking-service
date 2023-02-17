import { BadRequestException, Logger } from '@nestjs/common';

export class CorreiosExceptionFilter extends BadRequestException {
  public provider = 'correios-service-delivery-provider';

  private logger = new Logger(CorreiosExceptionFilter.name);

  private readonly originalError: string;

  constructor(message: string) {
    super('Houve um erro a contatar com o provedor de serviço');
    this.originalError = message;

    this.logger.error(this.originalError);
  }
}
