import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import logo from '../assets/SaladLockup-BlueBg.svg'
import { Button } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.appBackgroundColor,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '2rem',
    display: 'flex',
    flex: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
  },
  logo: {
    paddingBottom: '2rem',
  },
  column: {
    flex: 1,
    flexShrink: 0,
  },
  contentContainer: {
    color: theme.offWhite,
    fontFamily: 'SharpGroteskLight09',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // overflowY: 'scroll',
  },
  childrenContainer: {
    flexGrow: 2,
    alignSelf: 'stretch',
  },
  title: {
    fontSize: theme.xxLarge,
  },
  subtitle: {
    fontSize: theme.xLarge,
  },
  nextButton: {
    margin: '0 .5rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  title?: string
  subtitle?: string
  image?: string
  rightContent?: React.ReactNode
  hasBack?: boolean
  nextText?: string

  onBack?: () => void
  onNext?: () => void
}

class _OnboardingPage extends Component<Props> {
  render() {
    const { title, nextText, onNext, hasBack, subtitle, onBack, image, rightContent, classes, children } = this.props

    return (
      <div className={classnames(classes.container, 'is-unselectable')}>
        <div className={classnames(classes.contentContainer, classes.column)}>
          <img className={classes.logo} src={logo} />
          {title && <div className={classes.title}>{title}</div>}
          {subtitle && <div className={classes.subtitle}>{subtitle}</div>}
          <div className={classes.childrenContainer}>{children}</div>
          <div>
            {hasBack && (
              <Button disabled={!hasBack} onClick={onBack}>
                Back
              </Button>
            )}
            <Button className={classes.nextButton} onClick={onNext}>
              {nextText ? nextText : 'Next'}
            </Button>
          </div>
        </div>
        <div className={classnames(classes.imageContainer, classes.column)}>
          {rightContent}
          {!rightContent && image && <img src={image} />}
        </div>
      </div>
    )
  }
}

export const OnboardingPage = withStyles(styles)(_OnboardingPage)
