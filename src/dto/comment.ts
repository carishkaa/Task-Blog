import { FromSchema } from 'json-schema-to-ts'
import { articleShortDtoOut } from './article'

export const commentDtoIn = {
  type: 'object',
  required: ['articleId', 'content'],
  properties: {
    articleId: { type: 'string', },
    content: { type: 'string' },
  },
} as const

export type CommentDtoIn = FromSchema<typeof commentDtoIn>

export const commentDtoOut = {
  type: 'object',
  required: ['author'],
  properties: {
    id: { type: 'string', format: 'uuid'},
    article: articleShortDtoOut,
    author: { type: 'string' },
    content: { type: 'string' },
    score: { type: 'number' }, 
    createdAt: { type: 'string' }
  },
} as const

export type CommentDtoOut = FromSchema<typeof commentDtoOut>

export const commentParamsDtoIn = {
  type: 'object',
  required: ['commentId'],
  properties: {
    commentId: { type: 'string', format: 'uuid' },
  },
} as const

export type CommentParamsDtoIn = FromSchema<typeof commentParamsDtoIn>