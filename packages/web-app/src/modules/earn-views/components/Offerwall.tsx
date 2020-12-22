import { Component } from 'react'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head, P, Scrollbar, SectionHeader, SmartLink } from '../../../components'
import offerWallExample from '../assets/offerwall-overview.svg'
import offerWall from '../assets/offerwall.svg'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    // height: '100%',
    overflowX: 'hidden',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  descriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  offerwallWrapper: {
    position: 'relative',
    flexGrow: 1,
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexBasis: '50%',
  },

  overviewImage: {
    maxWidth: 600,
    width: '100%',
    padding: '40px 0px',
    margin: 'auto',
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
              <SectionHeader>What Are Offerwalls?</SectionHeader>
              <div className={classes.splitContainer}>
                <div className={classes.column} style={{ paddingRight: 20 }}>
                  <P>
                    Offerwalls are easy, simply browse our collection of offerwall partners to find an offer. Click on
                    any of the offers to learn more about what is required to complete the offer. Once you have
                    completed an offer, you will automatically be rewarded with your new Salad balance.
                  </P>
                </div>
                <div className={classes.column}>
                  <Img src={offerWall} />
                </div>
              </div>
              <Divider />
              <SectionHeader>Getting Started</SectionHeader>
              <Img className={classes.overviewImage} src={offerWallExample} />
              <Divider />
              <SectionHeader>More Information</SectionHeader>
              <P>
                <SmartLink
                  to={
                    'https://salad.zendesk.com/hc/en-us/articles/360041472991-The-Salad-Guide-to-AdGem-and-Offerwalls'
                  }
                >
                  Learn More About Offerwalls
                </SmartLink>
              </P>
              <P>
                <SmartLink to="https://support.salad.io/hc/en-us/articles/360042454192-I-Need-Help-with-Offerwalls">
                  Having Issues With an Offerwall?
                </SmartLink>
              </P>
              <Divider />
              <P>
                <i>
                  Note: These services are run by third-party sites and you should practice absolute security and
                  awareness while using it. Salad does not condone the collection of private information. If you
                  encounter anything suspicious, please let us know immediately.
                </i>
                <br />
                <br />
                <i>
                  - It may take up to 24 hours to receive your balance
                  <br /> - BlueStacks or other device emulators may not be supported by offerwall providers
                  <br />- The use of a VPN may result in a ban by the offerwall provider
                </i>
              </P>
              <Divider />
            </div>
          </div>
        </div>
      </Scrollbar>
    )
  }
}

export const Offerwall = withStyles(styles)(_Offerwall)
