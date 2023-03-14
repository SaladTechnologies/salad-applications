import type { ReactNode } from 'react'
import { Component } from 'react'
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

  public override componentDidMount() {
    document.body.appendChild(this.portalElement)
  }

  public override componentWillUnmount() {
    document.body.removeChild(this.portalElement)
  }

  public override render(): ReactNode {
    const { children } = this.props
    return ReactDOM.createPortal(children, this.portalElement)
  }
}
