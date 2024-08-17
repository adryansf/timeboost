export enum ExceptionTypeEnum {
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
}

export class ServiceException extends Error {
  constructor(
    public type: ExceptionTypeEnum,
    message: string,
  ) {
    super(message);
    this.name = 'ServiceException';
  }
}
