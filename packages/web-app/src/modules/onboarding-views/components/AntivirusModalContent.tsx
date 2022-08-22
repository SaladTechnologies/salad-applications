import { Button, Text } from '@saladtechnologies/garden-components'
import { ChevronRight } from '@saladtechnologies/garden-icons'
import classnames from 'classnames'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink } from '../../../components'
import { AntiVirusSoftware } from '../../onboarding/models'
import { antivirusInfo } from '../../onboarding/utils'

const styles = () => ({
  antivirusButtons: {
    flexBasis: '48%',
  },
  antivirusButtonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    textAlign: 'center',
  },
  mb12: {
    marginBottom: 12,
  },
  mb24: {
    marginBottom: 24,
  },
  mb48: {
    marginBottom: 48,
  },
  mb54: {
    marginBottom: 54,
  },
})

export interface AntivirusModalContentProps extends WithStyles<typeof styles> {
  navigateToAVGuide: (antivirusSoftwareName: AntiVirusSoftware, label: string) => void
  onNoAVClick: () => void
}

const _AntivirusModalContent = ({ classes, navigateToAVGuide, onNoAVClick }: AntivirusModalContentProps) => {
  return (
    <div className={classes.modalContainer}>
      <div>
        <div className={classes.mb24}>
          <Text variant="baseS">
            If your antivirus is not listed,{' '}
            <SmartLink
              trackingInfo={{ label: 'Onboarding - Antivirus not listed - We can help blog' }}
              to="https://support.salad.com/hc/en-us/articles/4404212712340"
            >
              we can help.
            </SmartLink>
          </Text>
        </div>
        <div className={classes.mb48}>
          <Button variant="outlined" label="I don't use Antivirus" onClick={onNoAVClick} />
        </div>
      </div>
      <div className={classnames(classes.antivirusButtonContainer, classes.mb54)}>
        {antivirusInfo.map((AV, index) => (
          <span key={index} className={classnames(classes.antivirusButtonContainer, classes.mb12)}>
            <Button
              width={246}
              label={AV.label}
              variant="outlined"
              leadingImage={AV.src}
              leadingImageAlt={AV.label}
              trailingIcon={<ChevronRight />}
              contentAlignment="space-between"
              onClick={() => navigateToAVGuide(AV.name, AV.label)}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

export const AntivirusModalContent = withStyles(styles)(_AntivirusModalContent)
