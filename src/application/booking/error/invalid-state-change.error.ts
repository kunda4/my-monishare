import { CustomError } from 'ts-custom-error'

export class InvalidStateChange extends CustomError {
  public constructor() {
    super('Invalid booking state change')
  }
}
