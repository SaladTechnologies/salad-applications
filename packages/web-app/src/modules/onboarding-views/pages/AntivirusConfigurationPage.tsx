import { Button, ButtonLink, FieldContainer, GlassBox, SvgIcon, Text } from '@saladtechnologies/garden-components'
import { ChevronRight } from '@saladtechnologies/garden-icons'
import classnames from 'classnames'
import { useEffect, useRef } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Head, SmartLink } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import { AntiVirusSoftware } from '../../zendesk/models'
import DiscordIcon from '../assets/DiscordIcon'
import GithubIcon from '../assets/GithubIcon'
import VirusTotal from '../assets/virusTotal.png'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'fixed',
    top: (props: AntivirusConfigurationPageProps) => (props.isNative ? '4.1rem' : 0),
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
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
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    color: theme.darkBlue,
    marginTop: 96,
    maxWidth: 560,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'left',
    padding: '0 15px',
  },
  contentCentered: {
    alignItems: 'center',
  },
  header: {
    color: theme.lightGreen,
  },
  mb48: {
    marginBottom: 48,
  },
  mb24: {
    marginBottom: 24,
  },
  mt12: {
    marginTop: 12,
  },
  mb12: {
    marginBottom: 12,
  },
  image: {
    display: 'flex',
    flex: 1,
    maxWidth: 560,
    height: 'auto',
    width: '100%',
  },
  proofContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  proofItem: {
    paddingTop: 40,
  },
  centerText: {
    textAlign: 'center',
  },
  trustpilot: {
    maxWidth: 156,
    height: 90,
    marginBottom: 0,
  },
  underline: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
})

export interface AntivirusConfigurationPageProps extends WithStyles<typeof styles> {
  detectedAV?: AntiVirusSoftware
  isNative?: boolean
  onViewAVGuide: () => void
  onViewAVGuideLabel: string
  onWhitelistWindowsDefender: () => void
  onViewAVGuideSelectionModal: () => void
}

const _AntivirusConfigurationPage = ({
  classes,
  detectedAV,
  onViewAVGuide,
  onViewAVGuideLabel,
  onViewAVGuideSelectionModal,
  onWhitelistWindowsDefender,
}: AntivirusConfigurationPageProps) => {
  const ref = useRef(null)
  useEffect(() => {
    if (window.Trustpilot) {
      window.Trustpilot.loadFromElement(ref.current, true)
    }
  }, [])

  return (
    <div className={classes.container}>
      <div className={classes.page}>
        <div className={classes.contentContainer}>
          <Head title="Antivirus Configuration" />
          <div className={classes.content}>
            <div className={classnames(classes.header, classes.mb48)}>
              <Text variant="headline">Antivirus Configuration</Text>
            </div>
            <FieldContainer>
              <div className={classes.mb24}>
                <Text variant="baseL">
                  Antivirus programs sometimes flag Salad by mistake, and may show warning messages when you start
                  earning for the first time.
                </Text>
                <br />
                <Text variant="baseS">
                  <SmartLink to="https://salad.com/blog/why-do-antivirus-programs-block-miners/">Learn why</SmartLink>
                </Text>
              </div>
              <div className={classes.mb24}>
                <Text variant="baseL">
                  To maximize your earning rates and ensure a hassle-free setup, we highly recommend whitelisting Salad
                  in your antivirus first. Follow our easy guide below to learn how.
                </Text>
              </div>
              {detectedAV === AntiVirusSoftware.WindowsDefender ? (
                <>
                  <div className={classes.mb48}>
                    <Button
                      label="Whitelist Salad in Windows Defender"
                      onClick={onWhitelistWindowsDefender}
                      variant="primary-basic"
                      trailingIcon={<ChevronRight />}
                    />
                    <div className={classes.mt12}>
                      <Text variant="baseS">
                        You’ll need to click ‘Yes’ in the popup that appears in order to finish whitelisting.
                      </Text>
                    </div>
                  </div>
                  <div className={classes.mb24}>
                    <Button label={onViewAVGuideLabel} onClick={onViewAVGuide} variant={'outlined'} />
                  </div>
                  <Text variant="baseS">
                    Use a different antivirus provider?{' '}
                    <span className={classes.underline} onClick={onViewAVGuideSelectionModal}>
                      Select it here
                    </span>
                    .
                  </Text>
                </>
              ) : (
                <>
                  <div className={classes.mb48}>
                    <div className={classes.mb24}>
                      <Button
                        label={onViewAVGuideLabel}
                        onClick={onViewAVGuide}
                        variant="primary-basic"
                        trailingIcon={<ChevronRight />}
                      />
                    </div>
                    {detectedAV !== undefined && (
                      <Text variant="baseS">
                        Use a different antivirus provider?{' '}
                        <span className={classes.underline} onClick={onViewAVGuideSelectionModal}>
                          Select it here
                        </span>
                        .
                      </Text>
                    )}
                  </div>
                  <div className={classes.mb24}>
                    <div className={classes.mb12}>
                      <Text variant="baseL">Optional: </Text>
                    </div>
                    <Button
                      label="Whitelist Salad in Windows Defender"
                      onClick={onWhitelistWindowsDefender}
                      variant="outlined"
                    />
                    <div className={classes.mt12}>
                      <Text variant="baseS">
                        You’ll need to click ‘Yes’ in the popup that appears in order to finish whitelisting.
                      </Text>
                    </div>
                  </div>
                </>
              )}
            </FieldContainer>
          </div>
          <div className={classnames(classes.content, classes.contentCentered)}>
            <GlassBox>
              <div className={classes.centerText}>
                <Text variant="baseM">
                  Still uncertain? Salad is 100% safe, but you don’t need to take our word for it.
                </Text>
              </div>
              <div className={classes.proofContainer}>
                <div className={classnames(classes.proofItem, classes.centerText)}>
                  <div className={classes.mb24}>
                    <Text variant="baseS">
                      <b>See VirusTotal Results</b>
                    </Text>
                  </div>
                  <SmartLink to="https://www.virustotal.com/gui/file/0ffa1ff74bc4c3ea3d68cc07b7eea0ae6a182e828024596c241b14fbcdeb1af9/detection">
                    <img alt="VirusTotal logo" src={VirusTotal} />
                  </SmartLink>
                </div>
                <div className={classnames(classes.proofItem, classes.centerText)}>
                  <div className={classes.mb24}>
                    <Text variant="baseS">
                      <b>Read Reviews</b>
                    </Text>
                  </div>
                  <div
                    ref={ref}
                    className={classnames(classes.trustpilot, 'trustpilot-widget')}
                    data-locale="en-US"
                    data-template-id="53aa8807dec7e10d38f59f32"
                    data-businessunit-id="60900bf8b8c01f000171d749"
                    data-style-height="100%"
                    data-style-width="100%"
                    data-theme="dark"
                  >
                    <SmartLink to="https://www.trustpilot.com/review/salad.com">Trustpilot</SmartLink>
                  </div>
                </div>
                <div className={classnames(classes.proofItem, classes.centerText)}>
                  <div className={classes.mb24}>
                    <Text variant="baseS">
                      <b>Ask the Community</b>
                    </Text>
                  </div>
                  <ButtonLink
                    label="30K+ Chefs on Discord"
                    to="https://discord.gg/salad"
                    variant="outlined"
                    trailingIcon={
                      <SvgIcon size={'large'} stroke="light">
                        <DiscordIcon />
                      </SvgIcon>
                    }
                  />
                </div>
                <div className={classnames(classes.proofItem, classes.centerText)}>
                  <div className={classes.mb24}>
                    <Text variant="baseS">
                      <b>We're Open Source</b>
                    </Text>
                  </div>
                  <ButtonLink
                    label="Explore our Code"
                    to="https://github.com/SaladTechnologies/"
                    variant="outlined"
                    trailingIcon={
                      <SvgIcon size={'large'} stroke="light">
                        <GithubIcon />
                      </SvgIcon>
                    }
                  />
                </div>
              </div>
            </GlassBox>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AntivirusConfigurationPage = withStyles(styles)(_AntivirusConfigurationPage)
