import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import type { SaladTheme } from '../../../SaladTheme'
import type { Reward } from '../../reward/models'
import { RewardDetailsContentPanel } from './RewardDetailsContentPanel'
import { RewardSystemDetailsList } from './RewardSystemDetailsList'

const styles = (theme: SaladTheme) => ({
  titleText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 20,
    textTransform: 'capitalize',
  },
  tabs: {},
  tabList: {
    display: 'flex',
    paddingInlineStart: 0, //Removes the default left padding for a <ul/>
    marginBottom: 0,
  },
  greenMaterial: {
    border: '1px solid rgba(255, 255, 255, 0.10)',
    backdropFilter: 'blur(8.57952px)',
    background:
      'linear-gradient(199.25deg, rgba(41, 105, 45, 0.6) -29.38%, rgba(41, 105, 45, 0.48) 20.22%, rgba(83, 166, 38, 0.6) 50.51%, rgba(51, 130, 56, 0.6) 89.66%)',
  },
  tab: {
    cursor: 'pointer',
    listStyle: 'none',
    padding: '12px 24px',
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    width: 100,
    textAlign: 'center',
    // boxShadow:
    // '2.85984px 8.57952px 22.8787px #53A626, 11.4394px 5.71968px 52.1921px rgba(83, 166, 38, 0.5), 24.3086px 24.3086px 35.748px rgba(0, 0, 0, 0.25), inset -5.71968px -4.28976px 57.1968px rgba(178, 213, 48, 0.1)',
  },
  selectedTab: {
    borderColor: theme.lightGreen,
  },
  tabPanel: {
    display: 'none',
    padding: 20,
  },
  selectedTabPanel: {
    border: '1px solid rgba(255, 255, 255, 0.10)',
    display: 'flex',
    minHeight: 400,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
}

class _RewardRequirementsPanel extends Component<Props> {
  public override render(): ReactNode {
    const { reward, classes } = this.props

    //Skip if there are no requirements
    if (!reward || !reward.requirements) {
      return null
    }

    //Check to see if there are system requirements
    let hasSystemRequirements = reward.requirements.systems && reward.requirements.systems.size !== 0

    //Since there are only system requirements, we skip. Once we have other kinds we can just hide specific portions of this panel
    if (!hasSystemRequirements) {
      return null
    }

    return (
      <RewardDetailsContentPanel>
        <div className={classes.titleText}>Requirements</div>
        <Tabs className={classes.tabs}>
          <TabList className={classes.tabList}>
            {reward.requirements.systems &&
              Array.from(reward.requirements.systems).map(([system]) => (
                <Tab className={classnames(classes.tab, classes.greenMaterial)} selectedClassName={classes.selectedTab}>
                  {system}
                </Tab>
              ))}
          </TabList>

          {reward.requirements.systems &&
            Array.from(reward.requirements.systems).map(([_system, requirements]) => (
              <TabPanel
                className={classes.tabPanel}
                selectedClassName={classnames(classes.selectedTabPanel, classes.greenMaterial)}
              >
                {requirements.minimum && (
                  <RewardSystemDetailsList title={'Minimum'} systemDetails={requirements.minimum} />
                )}
                {requirements.recommended && (
                  <RewardSystemDetailsList title={'Recommended'} systemDetails={requirements.recommended} />
                )}
              </TabPanel>
            ))}
        </Tabs>
      </RewardDetailsContentPanel>
    )
  }
}

export const RewardRequirementsPanel = withStyles(styles)(_RewardRequirementsPanel)
