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
    top: (props: MachineSettingsPageProps) => (props.isNative ? '4.1rem' : 0),
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
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 56,
  },
  workloadContainer: {
    width: 294,
    marginRight: 24,
  },
  mb24: {
    marginBottom: 24,
  },
  machineSettingPanels: {},
})

export interface MachineSettingsPageProps extends WithStyles<typeof styles> {
  isNative?: boolean
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
              <div className={classnames(classes.mb24, classes.lightGreenColor)}>
                <Text variant="base3XL">Hardware Configurations</Text>
              </div>
              <div className={classes.workloadsContainer}>
                {workloads.map((workload, index) => (
                  <div className={classes.workloadContainer} key={index}>
                    <WorkloadCard
                      key={index}
                      glow={workload.glow}
                      onToggleWorkload={workload.onToggleWorkload}
                      onToggleWorkloadLabel={workload.onToggleWorkloadLabel}
                      onToggleWorkloadDisabled={workload.onToggleWorkloadDisabled}
                      onToggleWorkloadLoading={workload.onToggleWorkloadLoading}
                      title={workload.title}
                      type={workload.type}
                    />
                  </div>
                ))}
              </div>
              {desktopSettings.length > 0 && (
                <div>
                  <div className={classnames(classes.title, classes.lightGreenColor)}>
                    <Text variant="base3XL">Desktop</Text>
                  </div>
                  <MachineSettingsList panels={desktopSettings} />
                </div>
              )}
            </div>
          </Layout>
        </Scrollbars>
      </div>
    </div>
  )
}

export const MachineSettingsPage = withStyles(styles)(_MachineSettingsPage)
