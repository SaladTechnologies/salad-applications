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
          What do the demand levels mean:
        </Text>
        <div className={classes.descriptionWrapper}>
          <Text className={classes.description}>
            The demand for any GPU in the table (each line) can be marked with one of the three following values:
            <ul>
              <li>
                <strong>Low</strong>
              </li>
            </ul>
            A GPU marked with Low demand suggests that there are currently more Chefs that are actively Chopping and
            waiting for a job than there are jobs available.
            <ul>
              <li>
                <strong>Moderate</strong>
              </li>
            </ul>
            A GPU marked with Moderate demand suggests that jobs are available in the network for this GPU class, but
            there may still be some periods where the machine remains idle since there are more Chefs Chopping than
            there are jobs.
            <ul>
              <li>
                <strong>High</strong>
              </li>
            </ul>
            A GPU marked with High demand suggests that Chefs with this type of hardware should see minimal gaps in
            their earning experience, and the machines should be able to get jobs fairly consistently.
          </Text>
        </div>
        <div className={classes.descriptionWrapper}>
          <Text className={classes.description}>
            Note that even though a GPU type may be in Low or Moderate supply, there are likely still jobs available for
            these machines - though Chefs can expect there to be some gaps in the earning experience after a job ends
            and the machine looks for the next job it can run on the network.
          </Text>
        </div>
        <Text as="h3" className={classes.descriptionHeader}>
          Why does higher demand not always equal higher payouts?
        </Text>
        <div className={classes.descriptionWrapper}>
          <Text className={classes.description}>
            Salad offers GPUs at different priority tiers, each commanding a different hourly rate, so job availability
            (demand) is not tied to what those jobs are paying. Chefs should make an informed decision using all
            available data.
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
