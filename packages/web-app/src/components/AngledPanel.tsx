import React, { CSSProperties, ReactNode, Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import classNames from 'classnames'
import { SaladTheme } from '../SaladTheme'

export type AngleDirection = 'none' | 'left' | 'right'

const styles = (theme: SaladTheme) => ({
  container: {
    clipPath: getClipPath,
  },
})

/**
 * Calculates the polygon clip path based on the given props
 * @param props
 */
const getClipPath = (props: AngledComponentProps) => {
  const angle = 30

  //Calculates the number of pixels over the path should be
  const dx = props.height * Math.tan(angle * (Math.PI / 180))

  //Converts the pixels to % of the shape's width
  const offset = 100 * (dx / props.width)
  var upperLeft = '0 0'
  var lowerLeft = '0 100%'
  var upperRight = '100% 0'
  var lowerRight = '100% 100%'
  if (props.leftSide && props.leftSide === 'left') {
    lowerLeft = `${offset}% 100%`
  } else if (props.leftSide && props.leftSide === 'right') {
    upperLeft = `${offset}% 0`
  }
  if (props.rightSide && props.rightSide === 'left') {
    upperRight = `${100 - offset}% 0`
  } else if (props.rightSide && props.rightSide === 'right') {
    lowerRight = `${100 - offset}% 100%`
  }
  return `polygon(${upperLeft}, ${upperRight}, ${lowerRight}, ${lowerLeft})`
}

interface AngledComponentProps extends WithStyles<typeof styles> {
  leftSide?: AngleDirection
  rightSide?: AngleDirection
  style?: CSSProperties
  className?: string
  children?: ReactNode
  height: number
  width: number
  onClick?: () => void
  refCallback: (details: Element | null) => void
}

/**
 * Private component that actually renders the angled component.
 * @param param0 The props
 */
const _AngledComponent = ({ refCallback, style, className, classes, children, onClick }: AngledComponentProps) => (
  <div ref={refCallback} style={style} className={classNames(classes.container, className)} onClick={onClick}>
    {children}
  </div>
)

/**
 * The styles components
 */
const AngledComponent = withStyles(styles)(_AngledComponent)

interface AngledPanelProps {
  leftSide?: AngleDirection
  rightSide?: AngleDirection
  style?: CSSProperties
  onClick?: () => void
  children?: ReactNode
  className?: string
}

interface AngledPanelState {
  height: number
  width: number
}

class _AngledPanel extends Component<AngledPanelProps, AngledPanelState> {
  constructor(props: AngledPanelProps) {
    super(props)
    this.state = {
      height: 0,
      width: 0,
    }
  }

  /**
   * Listens for changes to the element and updates the state.
   * This state will then be to passed down to render the angled background.
   */
  refCallback = (element: Element | null) => {
    if (element) {
      let size = element.getBoundingClientRect()
      this.setState({ height: size.height, width: size.width })
    }
  }

  render() {
    const { className, children, ...rest } = this.props
    const { height, width } = this.state
    return (
      <AngledComponent
        {...rest}
        className={className}
        refCallback={this.refCallback}
        height={height}
        width={width}
        {...this.props}
      >
        {children}
      </AngledComponent>
    )
  }
}

/**
 * A simple panel with the ability to render angled edges
 */
export const AngledPanel = _AngledPanel
