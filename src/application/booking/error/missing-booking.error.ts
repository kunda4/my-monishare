import { CustomError } from 'ts-custom-error'

export class MissingBookingError extends CustomError {
  public constructor(message: string) {
    super(message)
  }
}
