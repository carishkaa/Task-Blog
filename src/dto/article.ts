import { FromSchema } from 'json-schema-to-ts'

export const articleDtoIn = {
  type: 'object',
  required: ['title', 'perex', 'content'],
  properties: {
    title: { type: 'string' },
    perex: { type: 'string' },
    content: { type: 'string' },
  },
} as const

export type ArticleDtoIn = FromSchema<typeof articleDtoIn>

export const articleDtoOut = {
  type: 'object',
  required: [],
  properties: {
    title: { type: 'string' },
    perex: { type: 'string' },
    content: { type: 'string' },
    comments: {type: 'array' }
  },
} as const

export type ArticleDtoOut = FromSchema<typeof articleDtoOut>

export const articleParamsDtoIn = {
  type: 'object',
  required: ['articleId'],
  properties: {
    articleId: { type: 'string' },
  },
} as const

export type ArticleParamsDtoIn = FromSchema<typeof articleParamsDtoIn>