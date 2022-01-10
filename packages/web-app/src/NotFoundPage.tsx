import { Component } from 'react'

interface Props {}

/**
 * A React Router route that only is available when Salad is running in the desktop app
 */
export class NotFoundPage extends Component<Props> {
  render() {
    return <div>Page not found</div>
  }
}
