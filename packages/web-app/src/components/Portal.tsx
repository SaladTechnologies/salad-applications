import { Component } from 'react'
import ReactDOM from 'react-dom'

export class Portal extends Component {
  private readonly portalElement: HTMLDivElement

  constructor(props: {}) {
    super(props)
    this.portalElement = document.createElement('div')
  }

  componentDidMount() {
    document.body.appendChild(this.portalElement)
  }

  componentWillUnmount() {
    document.body.removeChild(this.portalElement)
  }

  render() {
    const { children } = this.props
    return ReactDOM.createPortal(children, this.portalElement)
  }
}
