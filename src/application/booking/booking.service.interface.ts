import { type BookingID, type Booking } from "./booking"

export abstract class IBookingService {
    public abstract get(bookingId: BookingID): Promise<Booking>
    public abstract getAll(): Promise<Booking[]>
}