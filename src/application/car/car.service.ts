import {Injectable, Logger} from '@nestjs/common'
import { Except } from 'type-fest'

import { IDatabaseConnection } from '../../persistence'

import {Car, type CarID, CarProperties} from './car'
import { ICarRepository } from './car.repository.interface'