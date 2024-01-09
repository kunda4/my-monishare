import { MigrationBuilder } from 'node-pg-migrate'

export function up(pgm: MigrationBuilder): void {
  pgm.createType('booking_state', [
    'ACCEPTED',
    'PICKED_UP',
    'RETURNED',
    'DECLINED',
    'PENDING',
  ])

  pgm.createTable('bookings', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    start_date: {
      type: 'timestamp',
      notNull: true,
    },
    end_date: {
      type: 'timestamp',
      notNull: true,
    },
    car_id: {
      type: 'integer',
      notNull: true,
      references: 'cars',
      onDelete: 'CASCADE',
    },
    state: {
      type: 'booking_state',
      notNull: true,
    },
    renter_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
  })

  pgm.addConstraint('bookings', 'end_date_after_start_date', {
    check: 'end_date > start_date',
  })
}