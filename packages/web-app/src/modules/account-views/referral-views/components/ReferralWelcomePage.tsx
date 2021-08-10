import { Button, FieldContainer, Text } from '@saladtechnologies/garden-components'
import { ChevronRight } from '@saladtechnologies/garden-icons'
import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import MediaQuery from 'react-responsive'
import { SaladTheme } from '../../../../SaladTheme'
import LoginPageRewards from '../../../auth-views/assets/login-screen-rewards.png'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'fixed',
    top: (props: Props) => (props.isNative ? '4.1rem' : 0),
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    display: 'flex',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  contentContainer: {
    maxWidth: 1280,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    color: theme.darkBlue,
    marginTop: 96,
    maxWidth: 560,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'left',
    padding: '0 15px',
  },
  header: {
    color: theme.lightGreen,
  },
  mb48: {
    marginBottom: 48,
  },
  rightSideImage: {
    display: 'flex',
    flex: 1,
    maxWidth: 560,
    height: 'auto',
    width: '100%',
  },
})

interface Props extends WithStyles<typeof styles> {
  isNative: boolean
  username?: string
  onNextPage?: () => void
}

class _ReferralWelcomePage extends Component<Props> {
  render() {
    const { classes, onNextPage, username } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.page}>
          <div className={classes.contentContainer}>
            <>
              <div className={classes.content}>
                <div className={classnames(classes.header, classes.mb48)}>
                  <Text variant="headline">Welcome to the Kitchen, {username}!</Text>
                </div>
                <FieldContainer>
                  <div className={classes.mb48}>
                    <Text variant="baseL">
                      You’ve joined a community of over 500,000 Chefs who use Salad to earn games, gift cards, and other
                      rewards.
                    </Text>
                  </div>
                  <div className={classes.mb48}>
                    <Text variant="baseL">
                      Now, let’s get your machine set up with a quick process to maximize your earning rates.
                    </Text>
                  </div>
                </FieldContainer>
                <div>
                  <Button onClick={onNextPage} trailingIcon={<ChevronRight />} label="let's go"></Button>
                </div>
              </div>
              <MediaQuery minWidth={767}>
                <img className={classes.rightSideImage} src={LoginPageRewards} alt="Salad Reward Items" />
              </MediaQuery>
            </>
          </div>
        </div>
      </div>
    )
  }
}

export const ReferralWelcomePage = withStyles(styles)(_ReferralWelcomePage)
