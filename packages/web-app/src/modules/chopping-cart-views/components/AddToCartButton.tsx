import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { CartIcon } from '../assets/cart-icon'
import { CartIconOutline } from '../assets/cart-icon-outline'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    height: 54,
    width: 54,
    textTransform: 'uppercase',
    color: theme.lightGreen,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${theme.lightGreen}`,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  isInCart?: boolean
  onAddToCart?: (reward: Reward) => void
  onRemoveFromCart?: (reward: Reward) => void
}

class _AddToCartButton extends Component<Props> {
  handleClick = () => {
    const { isInCart, reward, onAddToCart, onRemoveFromCart } = this.props

    if (!reward) {
      return
    }

    if (isInCart) {
      onRemoveFromCart?.(reward)
    } else {
      onAddToCart?.(reward)
    }
  }
  render() {
    const { isInCart, classes } = this.props

    return (
      <div className={classes.container} onClick={this.handleClick}>
        {!isInCart && <CartIconOutline />}
        {isInCart && <CartIcon />}
      </div>
    )
  }
}

export const AddToCartButton = withStyles(styles)(_AddToCartButton)
