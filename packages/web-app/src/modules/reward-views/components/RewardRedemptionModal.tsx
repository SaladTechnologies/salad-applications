import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { AngledPanel, ModalPage, TextField, Button, Checkbox } from '../../../components'
import { Reward } from '../../reward/models/Reward'
import { RewardDetails, ContentType, StyleType } from '../../reward/models/RewardDetails'
import { Form, Field } from 'react-final-form'
import logo from '../../../components/assets/animated-logo-lg.gif'
import { observer } from 'mobx-react'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    position: 'relative',
    width: '790px',
    userSelect: 'none',
  },
  lock: {
    position: 'absolute',
    right: '.5rem',
    top: '.5rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  imageContainer: {
    height: '12rem',
    display: 'inline-block',
    width: '290px',
    backgroundColor: (props: Props) => (props.reward && props.reward.color) || theme.green,
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  rightContainer: {
    width: '37rem',
    padding: '.5rem',
    overflow: 'hidden',
    marginLeft: '.5rem',
    display: 'inline-flex',
    flexDirection: 'column',
    backgroundColor: (props: Props) => (props.reward && props.reward.redeemable ? theme.green : theme.darkGreen),
    color: (props: Props) => (props.reward && props.reward.redeemable ? theme.darkBlue : theme.green),
  },
  logoContainer: {
    paddingTop: '4rem',
  },
  logo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '3rem',
  },
  contentContainer: {},
  contentLabel: {
    display: 'inline',
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    textTransform: 'uppercase',
  },
  headerContent: {
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.medium,
  },
  titleContent: {
    fontFamily: 'sharpGroteskLight09',
    fontSize: theme.xLarge,
  },
  descriptionContent: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.medium,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  details?: RewardDetails
  submitting?: boolean
  onClickClose?: () => void
  onClickDone?: () => void
  onRedeem?: (rewardId: string, email: string) => void
}

interface FormTypes {
  email?: string
  [key: string]: any
}

@observer
class _RewardRedemptionModal extends Component<Props> {
  handleClose = () => {
    const { onClickClose } = this.props

    if (onClickClose) {
      onClickClose()
    }
  }

  handleDone = () => {
    const { onClickDone } = this.props

    if (onClickDone) {
      onClickDone()
    }
  }

  onSubmit = (values: {}) => {
    const { reward, onRedeem } = this.props
    let v = values as FormTypes
    if (reward && onRedeem && v.email) onRedeem(reward.id, v.email)
  }

  validate = (values: {}) => {
    const { details } = this.props

    let v = values as FormTypes
    const errors: FormTypes = {}
    if (v.email === undefined || v.email.length === 0) {
      errors.email = 'Required'
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v.email)) {
      errors.email = 'Invalid email'
    }

    if (details && details.content) {
      details.content.forEach(x => {
        if (x.type !== ContentType.checkbox) return

        let checkName = `check${x.id}`
        let a = !!v[checkName]

        if (!a) {
          errors[checkName] = 'Required'
        }
      })
    }

    return errors
  }

  render() {
    const { reward, submitting, details, classes } = this.props

    return (
      <ModalPage onCloseClicked={this.handleClose}>
        <div>{details && details.isLoading}</div>
        <div className={classnames(classes.container)}>
          <AngledPanel className={classes.imageContainer} leftSide={'right'}>
            {reward && <img className={classes.image} src={reward.imageSrc} draggable={false} />}
          </AngledPanel>

          <div className={classnames(classes.rightContainer)}>
            <div style={{ flex: '1' }}>
              <div className={classes.lock} onClick={this.handleClose}>
                <FontAwesomeIcon icon={faTimes} />
              </div>

              {!details || details.isLoading ? (
                <div className={classes.logoContainer}>
                  <img className={classes.logo} src={logo} />
                </div>
              ) : (
                <div className={classnames(classes.contentContainer)}>
                  <Form
                    onSubmit={this.onSubmit}
                    validate={this.validate}
                    render={({ handleSubmit }) => {
                      return (
                        <form onSubmit={handleSubmit}>
                          {details &&
                            details.content &&
                            details.content.map(x => {
                              switch (x.type) {
                                case ContentType.plainText:
                                  return (
                                    <div
                                      key={x.id}
                                      className={classnames({
                                        [classes.headerContent]: x.style === StyleType.header,
                                        [classes.titleContent]: x.style === StyleType.title,
                                        [classes.descriptionContent]: x.style === StyleType.description,
                                      })}
                                    >
                                      {x.value}
                                    </div>
                                  )
                                case ContentType.emailInput:
                                  return (
                                    <Field name="email" key={x.id}>
                                      {({ input, meta }) => (
                                        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1rem' }}>
                                          <div className={classes.contentLabel}>{x.label}</div>
                                          <TextField
                                            dark
                                            {...input}
                                            placeholder={x.value}
                                            errorText={meta.error && meta.touched && meta.error}
                                          />
                                        </div>
                                      )}
                                    </Field>
                                  )
                                case ContentType.checkbox:
                                  return (
                                    <Field name={'check' + x.id} type="checkbox" key={x.id}>
                                      {({ input, meta }) => (
                                        <div style={{ padding: '.25rem 0' }}>
                                          <Checkbox
                                            key={x.id}
                                            {...input}
                                            text={x.label}
                                            dark
                                            errorText={meta.error && meta.touched && meta.error}
                                          />
                                        </div>
                                      )}
                                    </Field>
                                  )
                                case ContentType.buttonAction:
                                  return (
                                    <Button key={x.id} type="submit" loading={submitting} disabled={submitting} dark>
                                      Bombs Away
                                    </Button>
                                  )
                                case ContentType.doneButton:
                                  return (
                                    <Button
                                      key={x.id}
                                      loading={submitting}
                                      disabled={submitting}
                                      dark
                                      onClick={this.handleDone}
                                    >
                                      Bombs Away
                                    </Button>
                                  )
                                default:
                                  throw new Error('Unsupported content type ' + x.type)
                              }
                            })}
                        </form>
                      )
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalPage>
    )
  }
}

export const RewardRedemptionModal = withStyles(styles)(_RewardRedemptionModal)
