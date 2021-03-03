import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { ButtonGroupProps } from 'react-multi-carousel/lib/types'
import { IconTriangleLeft, IconTriangleRight } from '../../reward-views/components/assets'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  button: {
    outline: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0 30px',
    display: 'flex',
    '&:hover': {
      opacity: 0.7,
    },
  },
}

interface Props extends ButtonGroupProps, WithStyles<typeof styles> {}

class _StorefrontHeroButtonGroup extends Component<Props> {
  render() {
    const { next, previous, classes } = this.props

    return (
      <div className={classes.container}>
        <button className={classes.button} onClick={previous}>
          <IconTriangleLeft />
        </button>
        <button className={classes.button} onClick={next}>
          <IconTriangleRight />
        </button>
      </div>
    )
  }
}

export const StorefrontHeroButtonGroup = withStyles(styles)(_StorefrontHeroButtonGroup)
