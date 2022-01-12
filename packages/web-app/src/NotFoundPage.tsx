import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from './SaladTheme'

export const styles = (theme: SaladTheme) => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Mallory',
  },
  card: {
    backgroundColor: theme.darkGreen,
    width: '100%',
    maxWidth: 680,
    padding: 64,
    background: 'linear-gradient(234.33deg, rgba(31, 79, 34, 0.05) -117.15%, #1F4F22 61.94%)',
    border: '1px solid #1F4F22',
    boxSizing: 'border-box',
    boxShadow: '0px 5px 30px rgba(31, 79, 34, 0.8), inset 0px 0px 50px #205123',
    backdropFilter: 'blur(10px)',
  },
  heading: {
    fontSize: '32px',
    lineHeight: '34px',
    textAlign: 'center',
    color: theme.lightGreen,
    maxWidth: '850px',
    margin: '0 auto 15px',
  },
  contentContainer: {
    margin: '0 auto',
    maxWidth: 325,
  },
  subheading: {
    fontSize: '16px',
    lineHeight: '20px',
    textAlign: 'center',
    color: theme.green,
  },
})

interface Props extends WithStyles<typeof styles> {}

/**
 * 404 Page
 */
class _NotFoundPage extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.card}>
          <div className={classes.heading}>Uh-oh, Chef.</div>
          <div className={classes.subheading}>That page doesn't appear to exist.</div>
        </div>
      </div>
    )
  }
}

export const NotFoundPage = withStyles(styles)(_NotFoundPage)
