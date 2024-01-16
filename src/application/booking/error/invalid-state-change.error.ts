import { CustomError } from 'ts-custom-error'

export class InvalidStateChange extends CustomError {
  public constructor(message: string) {
    super(message)
  }
}
