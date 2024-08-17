import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ServiceException,
  ExceptionTypeEnum,
} from '@/utils/exceptions/service.exception';

export const serviceExceptionHandler = (
  exception: ServiceException | Error,
) => {
  if (!(exception instanceof ServiceException)) {
    throw new InternalServerErrorException();
  }

  switch (exception.type) {
    case ExceptionTypeEnum.BAD_REQUEST:
      throw new BadRequestException(exception.message);
    case ExceptionTypeEnum.NOT_FOUND:
      throw new NotFoundException(exception.message);
    default:
      throw new InternalServerErrorException();
  }
};
