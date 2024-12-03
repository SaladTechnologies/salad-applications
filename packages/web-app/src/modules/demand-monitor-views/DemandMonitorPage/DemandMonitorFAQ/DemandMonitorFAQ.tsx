import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { DefaultTheme } from '../../../../SaladTheme'

import type { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme): Record<string, CSS.Properties> => ({
  header: {
    margin: 0,
    fontFamily: theme.fontGroteskLight09,
    color: theme.green,
    fontSize: '64px',
    fontWeight: 300,
    textShadow: '0px 0px 24px rgba(178, 213, 48, 0.7)',
  },
  descriptionHeader: {
    fontFamily: theme.fontMallory,
    color: theme.mediumGreen,
    fontSize: '16px',
    lineHeight: '24px',
    paddingBottom: '0px',
  },
  description: {
    fontFamily: theme.fontMallory,
    color: theme.lightGreen,
    fontSize: '16px',
    lineHeight: '24px',
  },
  descriptionWrapper: {
    marginTop: '24px',
  },
  allFaqButtonWrapper: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '8px',
  },
})

interface Props extends WithStyles<typeof styles> {}

const _DemandMonitorFAQ: FunctionComponent<Props> = ({ classes }) => {
  const handleAllFaqClick = () => {
    window.location.href = 'https://support.salad.com/collection/13-faq'
  }

  return (
    <div className={classes.tableWrapper}>
      <div className={classes.tableContent}>
        <Text as="h1" className={classes.header}>
          FAQ
        </Text>
        <Text as="h3" className={classes.descriptionHeader}>
          Why not show total numbers of machines in the network?
        </Text>
        <div className={classes.descriptionWrapper}>
          <Text className={classes.description}>
            The Salad network is made up of machines that may be available during several periods throughout the day. So
            if a job requires a GPU for 24 hours it may take several machines with that GPU to make up those 24 hours.
            This means that a count of machines in the network would not be enough to answer questions like “is it worth
            it to bring my hardware to Salad right now?”.
          </Text>
        </div>
        <div className={classes.descriptionWrapper}>
          <Text className={classes.description}>
            Instead we’re showing you a compound demand signal that takes into account total utilization of that GPU in
            the network along with average earnings and average running time for the last 24 hours.
          </Text>
        </div>
        <Text as="h3" className={classes.descriptionHeader}>
          What do the demand levels mean?
        </Text>
        <div className={classes.descriptionWrapper}>
          <Text className={classes.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mattis quam lacinia vestibulum efficitur.
            Donec a ex ut elit sollicitudin rhoncus a nec ipsum. Quisque mattis tincidunt dolor, vel molestie diam
            fermentum ut. Maecenas aliquet in elit id pharetra. Ut tortor tellus, interdum quis faucibus quis, pulvinar
            id lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec suscipit nunc. Nunc velit
            nulla, tincidunt vel lacinia ac, porta et velit. 
          </Text>
        </div>
        <Text as="h3" className={classes.descriptionHeader}>
          What is the average running time?
        </Text>
        <div className={classes.descriptionWrapper}>
          <Text className={classes.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mattis quam lacinia vestibulum efficitur.
            Donec a ex ut elit sollicitudin rhoncus a nec ipsum. Quisque mattis tincidunt dolor, vel molestie diam
            fermentum ut. Maecenas aliquet in elit id pharetra. Ut tortor tellus, interdum quis faucibus quis, pulvinar
            id lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec suscipit nunc. Nunc velit
            nulla, tincidunt vel lacinia ac, porta et velit. 
          </Text>
        </div>
      </div>
      <div className={classes.allFaqButtonWrapper}>
        <Text className={classes.description}>Have more questions?</Text>
        <Button
          variant="outlined"
          outlineColor={DefaultTheme.lightGreen}
          onClick={handleAllFaqClick}
          label="View all FAQs"
        />
      </div>
    </div>
  )
}

export const DemandMonitorFAQ = withStyles(styles)(_DemandMonitorFAQ)
