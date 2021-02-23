export interface ZendeskArticle {
  author_id: number
  body: string
  comments_disabled: boolean
  created_at: string
  draft: boolean
  edited_at: string
  html_url: string
  id: string
  label_names: string[]
  name: string
  outdated: boolean
  outdated_locales: string[]
  permission_group_id: number
  position: number
  promoted: boolean
  section_id: number
  source_locale: 'string'
  title: string
  updated_at: string
  url: string
  user_segment_id: number
  vote_count: number
  vote_sum: number
}
