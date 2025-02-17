import { useCallback, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { Divider, SectionHeader, StatElement } from '../../../components'
import { formatBalance } from '../../../utils'
import type { ChartDaysShowing, EarningPerMachine } from '../../balance/models'
import { EarningHistory } from '../../earn-views/components'
import { AllMachines } from '../../earn-views/components/AllMachines'
import { generatedMockedMachines, mockEarningPerMachine } from '../../earn-views/components/AllMachines/mocks'
import { MachineDetailsModal } from '../../earn-views/components/MachineDetailsModal'

const styles = (theme: SaladTheme) => ({
  item: {
    paddingTop: 10,
  },
  chartContainer: {
    display: 'flex',
    height: 250,
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  segmentsContainer: {
    '&>label:first-child': {
      borderRadius: '2px 0px 0px 2px',
    },
    '&>label:last-child': {
      borderRadius: '0px 2px 2px 0px',
    },
  },
  descriptionWrapper: {
    paddingLeft: '70px',
    color: theme.lightGreen,
  },
  subtitle: {
    fontFamily: 'Mallory',
    fontSize: '16px',
    color: theme.lightGreen,
    lineHeight: '1.5',
    marginBottom: '10px',
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  daysShowing: ChartDaysShowing
  last24HrEarnings: number
  last7DayEarnings: number
  last30DayEarnings: number
  lifetimeBalance?: number
  totalXp?: number
}

const _MobileEarningSummary = ({
  classes,
  currentBalance,
  daysShowing,
  last24HrEarnings,
  last7DayEarnings,
  last30DayEarnings,
  lifetimeBalance,
  totalXp,
}: Props) => {
  const [detailsModalMachineId, setDetailsModalMachineId] = useState<string | null>(null)
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([])

  const handleCloseMachineDetailsModal = () => {
    setDetailsModalMachineId(null)
  }

  const handleSelectedMachineIdsChange = useCallback((updatedSelectedMachineIds: string[]) => {
    setSelectedMachineIds(updatedSelectedMachineIds)
  }, [])

  const shownModalMachine = generatedMockedMachines.find((machine) => machine.id === detailsModalMachineId)

  const earningPerSelectedMachines = Object.keys(selectedMachineIds)
    .filter((id) => selectedMachineIds.includes(id))
    .reduce<EarningPerMachine>((acc, id) => {
      // Mocked data for earnings per machine
      if (mockEarningPerMachine[id]) {
        acc[id] = mockEarningPerMachine[id]
      }
      return acc
    }, {})

  return (
    <>
      <SectionHeader>Summary</SectionHeader>
      <div className={classes.item}>
        <StatElement
          title="Current Balance"
          values={[formatBalance(currentBalance)]}
          infoText="Current balance available to spend"
        />
      </div>
      <div className={classes.item}>
        <StatElement
          title="Lifetime Balance"
          values={[formatBalance(lifetimeBalance)]}
          infoText="Total balance earned"
        />
      </div>
      <div className={classes.item}>
        <StatElement
          title="Total XP"
          values={[Math.round(totalXp ?? 0).toLocaleString()]}
          infoText={`XP stands for "Experience Points". You are awarded 1 XP per minute of confirmed mining time. The more XP you have, the more veggies you will unlock in the Pantry.`}
        />
      </div>
      <div className={classes.item}>
        <StatElement
          title="Earnings last 24 hours"
          values={[formatBalance(last24HrEarnings)]}
          infoText="Last 24 hours balance earned"
        />
      </div>
      <div className={classes.item}>
        <StatElement
          title="Earnings last 7 days"
          values={[formatBalance(last7DayEarnings)]}
          infoText="Last 7 days balance earned"
        />
      </div>
      <div className={classes.item}>
        <StatElement
          title="Earnings last 30 days"
          values={[formatBalance(last30DayEarnings)]}
          infoText="Last 30 days balance earned"
        />
      </div>
      <Divider />
      <AllMachines
        machines={generatedMockedMachines}
        onMachineIdClick={setDetailsModalMachineId}
        onSelectedMachineIdsChange={handleSelectedMachineIdsChange}
      />
      <EarningHistory
        daysShowing={daysShowing}
        earningsPerMachine={earningPerSelectedMachines}
        viewLast24Hours={viewLast24Hours}
        viewLast7Days={viewLast7Days}
        viewLast30Days={viewLast30Days}
      />
      {shownModalMachine && (
        <MachineDetailsModal {...shownModalMachine} onCloseClick={handleCloseMachineDetailsModal} />
      )}
      <Divider />
    </>
  )
}

export const MobileEarningSummary = withStyles(styles)(_MobileEarningSummary)
