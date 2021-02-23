import { ZendeskArticle } from './ZendeskArticle'

export interface ZendeskArticleList {
  articles: ZendeskArticle[]
  count: number
  next_page?: number
  page: number
  page_count: number
  per_page: number
  previous_page?: number
  sort_by: string
  sore_order: 'asc' | 'dsc'
}
