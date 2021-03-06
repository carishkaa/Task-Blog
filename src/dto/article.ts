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
    id: { type: 'string', format: 'uuid'},
    title: { type: 'string' },
    perex: { type: 'string' },
    content: { type: 'string' },
    comments: { type: 'array' },
    createdAt: { type: 'string', format: 'data-time'}
  },
} as const

export type ArticleDtoOut = FromSchema<typeof articleDtoOut>

export const articleShortDtoOut = {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'string', format: 'uuid'},
    title: { type: 'string' },
    perex: { type: 'string' },
    createdAt: { type: 'string'}
  },
} as const

export type ArticleShortDtoOut = FromSchema<typeof articleShortDtoOut>

export const articleParamsDtoIn = {
  type: 'object',
  required: ['articleId'],
  properties: {
    articleId: { type: 'string', format: 'uuid' },
  },
} as const

export type ArticleParamsDtoIn = FromSchema<typeof articleParamsDtoIn>