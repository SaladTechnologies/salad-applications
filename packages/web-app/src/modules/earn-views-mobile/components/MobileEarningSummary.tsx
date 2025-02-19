import { useCallback, useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import type { Machine } from '../../../api/machinesApiClient/generated/models'
import { Divider, SectionHeader, StatElement } from '../../../components'
import { formatBalance } from '../../../utils'
import type { CurrentHourlyEarningRatesPerMachine, EarningPerMachine } from '../../balance/models'
import { EarningHistoryContainer } from '../../earn-views/components'
import { AllMachines } from '../../earn-views/components/AllMachines'
import { MachineDetailsModal } from '../../earn-views/components/AllMachines/MachineDetailsModal'
import type { MachineDetails } from '../../earn-views/components/AllMachines/utils'
import { getMachineDetailsList } from '../../earn-views/components/AllMachines/utils'

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
  earningsPerMachine: EarningPerMachine
  last24HrEarnings: number
  last7DayEarnings: number
  last30DayEarnings: number
  lifetimeBalance?: number
  totalXp?: number
  machines: Machine[]
  currentHourlyEarningRatesPerMachine: CurrentHourlyEarningRatesPerMachine
  fetchCurrentEarningRatesPerMachine: () => void
  fetchEarningsPerMachine: () => void
}

const _MobileEarningSummary = ({
  classes,
  earningsPerMachine,
  currentBalance,
  last24HrEarnings,
  last7DayEarnings,
  last30DayEarnings,
  lifetimeBalance,
  totalXp,
  machines,
  currentHourlyEarningRatesPerMachine,
  fetchCurrentEarningRatesPerMachine,
  fetchEarningsPerMachine,
}: Props) => {
  const [detailsModalMachineId, setDetailsModalMachineId] = useState<string | null>(null)
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([])

  const handleCloseMachineDetailsModal = () => {
    setDetailsModalMachineId(null)
  }

  useEffect(() => {
    fetchCurrentEarningRatesPerMachine()
    fetchEarningsPerMachine()
  }, [fetchCurrentEarningRatesPerMachine, fetchEarningsPerMachine])

  const handleSelectedMachineIdsChange = useCallback((updatedSelectedMachineIds: string[]) => {
    setSelectedMachineIds(updatedSelectedMachineIds)
  }, [])

  const earningsPerSelectedMachines = selectedMachineIds.reduce<EarningPerMachine>((acc, id) => {
    if (earningsPerMachine[id]) {
      acc[id] = earningsPerMachine[id]
    }
    return acc
  }, {})

  const shownInModalMachineDetails = machines.find(
    (machine) => machine.machine_id?.toString() === detailsModalMachineId,
  )

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
        machineDetailsList={getMachineDetailsList({ machines, currentHourlyEarningRatesPerMachine })}
        onMachineIdClick={setDetailsModalMachineId}
        onSelectedMachineIdsChange={handleSelectedMachineIdsChange}
      />
      <EarningHistoryContainer earningsPerMachine={earningsPerSelectedMachines} />
      {shownInModalMachineDetails && (
        <MachineDetailsModal
          machineDetails={shownInModalMachineDetails as MachineDetails}
          onCloseClick={handleCloseMachineDetailsModal}
        />
      )}
      <Divider />
    </>
  )
}

export const MobileEarningSummary = withStyles(styles)(_MobileEarningSummary)
