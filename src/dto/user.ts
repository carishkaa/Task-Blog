import { FromSchema } from 'json-schema-to-ts'

export const userDtoIn = {
  type: 'object',
  required: ['name', 'email', 'password', 'role'],
  additionalProperties: false,
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
} as const

export type UserDtoIn = FromSchema<typeof userDtoIn>

export const userDtoOut = {
  type: 'object',
  required: ['id', 'email'],
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
  },
} as const

export type UserDtoOut = FromSchema<typeof userDtoOut>
