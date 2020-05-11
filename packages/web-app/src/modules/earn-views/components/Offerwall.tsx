import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink, P, SectionHeader, Scrollbar, Head } from '../../../components'
import offerWallExample from '../assets/AdGem.png'
import Img from 'react-image'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    maxWidth: 800,
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

interface Props extends WithStyles<typeof styles> {}

class _Offerwall extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <Scrollbar>
        <Head title="Offerwalls" />
        <div className={classes.container}>
          <div className={classes.content}>
            <div className={classes.descriptionContainer}>
              <div>
                <SectionHeader>Getting Started</SectionHeader>
                <P>
                  Offerwalls are easy, simply browse our collection of offerwall partners to find an offer. Click on any
                  of the offers to learn more about what is required to complete the offer. Once you have completed an
                  offer, you will automatically be rewarded with your new Salad balance.
                </P>
                <P>
                  <SmartLink
                    to={
                      'https://salad.zendesk.com/hc/en-us/articles/360041472991-The-Salad-Guide-to-AdGem-and-Offerwalls'
                    }
                  >
                    Check out our FAQ for more info!
                  </SmartLink>
                </P>
              </div>
              <br />
              <P>Example AdGem Offers</P>
              <Img className={classes.exampleImage} src={offerWallExample} />
              <P>
                <P>
                  <i>
                    Note: These services are run by third-party sites and you should practice absolute security and
                    awareness while using it. Salad does not condone the collection of private information. If you
                    encounter anything suspicious, please let us know immediately.
                  </i>
                </P>
                <i>
                  - It may take up to 24 hours to receive your balance <br />
                  - BlueStacks or other device emulators may not be supported by offerwall providers
                  <br />- The use of a VPN may result in a ban by the offerwall provider
                </i>
              </P>
            </div>
          </div>
        </div>
      </Scrollbar>
    )
  }
}

export const Offerwall = withStyles(styles)(_Offerwall)
