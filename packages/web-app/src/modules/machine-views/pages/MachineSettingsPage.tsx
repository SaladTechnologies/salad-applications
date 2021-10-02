import { Layout, Text, WorkloadCard, WorkloadCardProps } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import Scrollbars from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { MachineSettingsList } from '../components/MachineSettingsList'
import { DesktopSettingPanels } from '../settings/models/DesktopSettingsPanel'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
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
    marginTop: 96,
    paddingBottom: 100,
    display: 'flex',
    width: '100%',
  },
  content: {
    padding: '0 15px',
    width: '100%',
  },
  lightGreenColor: {
    color: theme.lightGreen,
  },
  title: {
    borderBottom: `solid 1px ${theme.lightGreen}`,
    paddingBottom: 24,
    marginBottom: 24,
  },
  workloadsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gridGap: 24,
    '@media (min-width: 600px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    marginBottom: 64,
  },
  machineSettingPanels: {},
})

export interface MachineSettingsPageProps extends WithStyles<typeof styles> {
  desktopSettings: DesktopSettingPanels
  workloads: WorkloadCardProps[]
}

const _MachineSettingsPage = ({ classes, desktopSettings, workloads }: MachineSettingsPageProps) => {
  return (
    <div className={classes.container}>
      <div className={classes.page}>
        <Scrollbars>
          <Layout title="Machine Settings">
            <Head title="Machine Settings" />
            <div className={classes.content}>
              <div className={classes.workloadsContainer}>
                {workloads.map((workload, index) => (
                  <WorkloadCard
                    key={index}
                    glow={workload.glow}
                    onToggleWorkload={workload.onToggleWorkload}
                    onToggleWorkloadLabel={workload.onToggleWorkloadLabel}
                    onToggleOverride={workload.onToggleOverride}
                    onToggleOverrideLabel={workload.onToggleOverrideLabel}
                    onToggleOverrideDisabled={workload.onToggleOverrideDisabled}
                    onToggleOverrideTooltip={workload.onToggleOverrideTooltip}
                    overrideChecked={workload.overrideChecked}
                    title={workload.title}
                    type={workload.type}
                  />
                ))}
              </div>
              <div>
                <div className={classnames(classes.title, classes.lightGreenColor)}>
                  <Text variant="base3XL">Desktop</Text>
                </div>
                <MachineSettingsList panels={desktopSettings || []} />
              </div>
            </div>
          </Layout>
        </Scrollbars>
      </div>
    </div>
  )
}

export const MachineSettingsPage = withStyles(styles)(_MachineSettingsPage)
