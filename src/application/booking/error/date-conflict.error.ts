import { CustomError } from 'ts-custom-error'

export class DateConflictError extends CustomError {
  public constructor(message: string) {
    super(message)
  }
}
