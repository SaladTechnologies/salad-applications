import { Component, ReactNode } from 'react'
import ReactDOM from 'react-dom'

export interface PortalProps {
  children?: ReactNode
}

export class Portal extends Component<PortalProps> {
  private readonly portalElement: HTMLDivElement

  constructor(props: PortalProps) {
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
