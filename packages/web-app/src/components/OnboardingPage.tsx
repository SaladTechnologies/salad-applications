import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import classnames from 'classnames'
import logo from './assets/SaladLockup-BlueBg.svg'
import { Button } from '.'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.darkBlue,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flex: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    userSelect: 'none',
  },
  logo: {
    paddingBottom: '2rem',
  },
  column: {
    flex: 1,
    flexShrink: 0,
  },
  contentContainer: {
    color: theme.lightGreen,
    display: 'flex',
    padding: (props: Props) => props.leftColumnPadding || '4rem',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: '1 1 0',
    flexBasis: 0,
    minWidth: 0,
  },
  imageContainer: {
    display: (props: Props) => props.display || 'flex',
    padding: (props: Props) => props.rightColumnPadding || 0,
    justifyContent: 'center',
    alignItems: (props: Props) => (props.fullHeightImg ? 'stretch' : props.alignItems || 'center'),
    flex: '1 1 0',
    flexBasis: 0,
    minWidth: (props: Props) => props.rightColumnWidth || 0,
    overflow: 'hidden',
  },
  image: {
    objectFit: 'cover',
  },
  childrenContainer: {
    paddingTop: '2rem',
    flexGrow: 2,
    alignSelf: 'stretch',
  },
  title: {
    paddingTop: '2rem',
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xxLarge,
    lineHeight: '54px',
  },
  subtitle: {
    fontFamily: 'sharpGroteskLight25',
    fontSize: '18px',
    lineHeight: '32px',
    paddingTop: '3rem',
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
  rightColumnWidth?: string
  leftColumnPadding?: string
  rightColumnPadding?: string
  hasBack?: boolean
  nextText?: string
  nextSubmitting?: boolean
  fullHeightImg?: boolean,
  alignItems?: string,
  display?: string,
  onBack?: () => void
  onNext?: () => void
}

class _OnboardingPage extends Component<Props> {
  render() {
    const {
      title,
      nextText,
      onNext,
      nextSubmitting,
      hasBack,
      subtitle,
      onBack,
      image,
      rightContent,
      classes,
      children,
    } = this.props

    return (
      <div className={classnames(classes.container)}>
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
            <Button className={classes.nextButton} onClick={onNext} loading={nextSubmitting}>
              {nextText ? nextText : 'Next'}
            </Button>
          </div>
        </div>
        <div className={classnames(classes.imageContainer, classes.column)}>
          {rightContent}
          {!rightContent && image && <img className={classes.image} src={image} />}
        </div>
      </div>
    )
  }
}

export const OnboardingPage = withStyles(styles)(_OnboardingPage)
