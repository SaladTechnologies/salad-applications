import React, { Component } from 'react'
import { Range, getTrackBackground } from 'react-range'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  touchArea: {
    height: '36px',
    display: 'flex',
    width: '100%',
    cursor: 'pointer',
  },
  track: {
    height: '3px',
    width: '100%',
    borderRadius: '4px',
    backgroundColor: theme.lightGreen,
    alignSelf: 'center',
  },
  thumb: {
    height: 16,
    width: 16,
    backgroundColor: theme.mediumGreen,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    boxShadow: 'none',
    backgroundColor: 'initial',
    color: theme.lightGreen,
    cursor: 'not-allowed',
  },
})

interface Props extends WithStyles<typeof styles> {
  stepSize: number
  minimum: number
  maximum: number
  value: number
  onValueChange?: (value: number) => void
}

class _Slider extends Component<Props> {
  handleChange = (event: any) => {
    const { onValueChange } = this.props

    if (onValueChange) {
      onValueChange(event[0])
    }
  }
  render() {
    const { stepSize, minimum, maximum, value, classes } = this.props
    return (
      <Range
        values={[value]}
        step={stepSize}
        min={minimum}
        max={maximum}
        onChange={this.handleChange}
        renderTrack={({ props, children }) => (
          <div className={classes.touchArea} onMouseDown={props.onMouseDown} onTouchStart={props.onTouchStart}>
            <div
              ref={props.ref}
              className={classes.track}
              style={{
                background: getTrackBackground({
                  values: [value],
                  colors: ['#53A626', '#DBF1C1'],
                  min: minimum,
                  max: maximum,
                }),
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => <div className={classes.thumb} {...props} />}
      />
    )
  }
}

export const Slider = withStyles(styles)(_Slider)
