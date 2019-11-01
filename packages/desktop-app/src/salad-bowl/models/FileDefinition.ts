export interface FileDefinition {
  /** The full path of the file relative to the plugin. Including extension */
  filename: string
  /** The contents of the file */
  contents: string
}
