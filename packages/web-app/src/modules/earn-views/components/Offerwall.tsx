import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { ToggleSetting, ExternalLink, P } from '../../../components'
import offerWallExample from '../assets/AdGem.png'
import Img from 'react-image'
import Scrollbars from 'react-custom-scrollbars'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  fullHeight: {
    height: '100%',
  },
  descriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  offerwallWrapper: {
    position: 'relative',
    flexGrow: 1,
  },
  exampleImage: {
    width: '95%',
    maxWidth: 700,
  },
}

interface Props extends WithStyles<typeof styles> {
  offerwall?: boolean
  offerwallToggle?: () => void
  userId?: string
}

const disclaimer = (
  <i>
    Note: This service is run by a third-party site and you should practice absolute security and awareness while using
    it. Salad does not condone the collection of private information. If you encounter anything suspicious, please let
    us know immediately.
  </i>
)

class _Offerwall extends Component<Props> {
  render() {
    const { offerwall, offerwallToggle, userId, classes } = this.props

    return (
      <div className={classes.container}>
        {offerwall && (
          <div className={classnames(classes.content, classes.fullHeight)}>
            <div>
              <ToggleSetting
                title={'Offerwall'}
                description={offerwall ? disclaimer : ''}
                toggled={offerwall}
                onToggle={offerwallToggle}
              />
            </div>

            <div className={classnames(classes.offerwallWrapper)}>
              <iframe
                src={`https://api.adgem.com/v1/wall?appid=1735&playerid=${userId}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  margin: 0,
                  padding: 0,
                  overflow: 'hidden',
                  zIndex: 999999,
                }}
                title={`offerwall-${userId}`}
                sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
              >
                Your browser doesn't support iframes
              </iframe>
            </div>
          </div>
        )}

        {!offerwall && (
          <Scrollbars>
            <div className={classes.content}>
              <div>
                <ToggleSetting
                  title={'Offerwall'}
                  description={offerwall ? disclaimer : ''}
                  toggled={offerwall}
                  onToggle={offerwallToggle}
                />
              </div>
              <div className={classes.descriptionContainer}>
                <div>
                  <P>
                    Earn Salad Balance by completing tasks such as downloading and playing mobile games. Whether you
                    just want to top off your balance, boost your regular earnings, or can’t currently mine with Salad,
                    offerwalls allow you to make more money.
                  </P>
                  <P>
                    By partnering with AdGem, we now host a large catalog of offers, most of which are easily completed
                    and all provide extra earnings.
                  </P>
                  <P>
                    <P>{disclaimer}</P>
                    <i>
                      - It may take up to 24 hours to receive your balance <br />
                      - BlueStacks or other device emulators may not be supported by offerwall providers
                      <br />- The use of a VPN may result in a ban by the offerwall provider
                    </i>
                  </P>
                </div>
                <br />
                <P>Example</P>
                <Img className={classes.exampleImage} src={offerWallExample} />
                <br />
                <P>
                  <ExternalLink
                    path={
                      'https://salad.zendesk.com/hc/en-us/articles/360041472991-The-Salad-Guide-to-AdGem-and-Offerwalls'
                    }
                  >
                    Check out our FAQ for more info!
                  </ExternalLink>
                </P>
              </div>
            </div>
          </Scrollbars>
        )}
      </div>
    )
  }
}

export const Offerwall = withStyles(styles)(_Offerwall)
