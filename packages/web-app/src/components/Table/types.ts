type TableRowItem = string | number | JSX.Element

type TableRow = Array<TableRowItem>

export interface TableContent {
  titles: Array<JSX.Element | string>
  rows: Array<TableRow>
}
