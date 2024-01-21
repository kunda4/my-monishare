export enum BookingState {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  RETURNED = 'RETURNED',
}

type ValidBookingStatesType = Record<BookingState, BookingState[]>

export const ValidBookingStatesTransitions: ValidBookingStatesType = {
  [BookingState.PENDING]: [BookingState.ACCEPTED, BookingState.DECLINED],
  [BookingState.ACCEPTED]: [BookingState.PICKED_UP],
  [BookingState.PICKED_UP]: [BookingState.RETURNED],
  [BookingState.RETURNED]: [],
  [BookingState.DECLINED]: [],
}
