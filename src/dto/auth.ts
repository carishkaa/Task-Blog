import { FromSchema } from 'json-schema-to-ts'
import { userDtoOut } from './user'

export const loginDtoIn = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
} as const

export type LoginDtoIn = FromSchema<typeof loginDtoIn>

export const loginDtoOut = {
  type: 'object',
  required: ['jwt'],
  additionalProperties: false,
  properties: {
    jwt: { type: 'string' },
    user: userDtoOut,
  },
} as const

export type LoginDtoOut = FromSchema<typeof loginDtoOut>
