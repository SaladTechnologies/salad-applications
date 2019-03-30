import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Modal, ModalPage, TextField, Button } from '../../../components'
import { Form, Field } from 'react-final-form'

const styles = (theme: SaladTheme) => ({
  contentContainer: {
    color: theme.darkBlue,
    padding: '.25rem',
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
  onSend?: (email: string) => void
  sending?: boolean
}

interface FormTypes {
  email?: string
}

class _NewReferralModal extends Component<Props> {
  onSubmit = (values: {}) => {
    const { onSend } = this.props
    let v = values as FormTypes
    if (onSend && v.email) onSend(v.email)
  }

  validate = (values: {}) => {
    let v = values as FormTypes

    const errors: FormTypes = {}
    if (v.email === undefined || v.email.length === 0) {
      errors.email = 'Required'
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v.email)) {
      errors.email = 'Invalid email'
    }

    return errors
  }

  render() {
    const { sending, onCloseClicked, classes } = this.props
    return (
      <ModalPage onCloseClicked={onCloseClicked}>
        <Modal onCloseClicked={onCloseClicked}>
          <div className={classes.contentContainer}>
            <div className={classes.title}>$5 Refer a Friend Bonus!</div>
            <p className={classes.description}>
              Be wise in your referral, as you only get the bonus after your friend hits 720 XP. If their GPU isn't
              supported or they don’t run the app you’ll miss out. The more they’re chopping Salad, the faster you’ll
              get your bonus. Don’t forget to mention that they’ll get a $5 bonus upon reaching 720 XP as well!
            </p>
          </div>

          <Form
            onSubmit={this.onSubmit}
            validate={this.validate}
            render={({ handleSubmit }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Field name="email" type="email">
                    {({ input, meta }) => (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          paddingTop: '1rem',
                        }}
                      >
                        <TextField
                          {...input}
                          dark
                          placeholder="Email Address"
                          errorText={meta.error && meta.touched && meta.error}
                        />
                        <Button type="submit" dark loading={sending} disabled={sending}>
                          BOMBS AWAY
                        </Button>
                      </div>
                    )}
                  </Field>
                </form>
              )
            }}
          />
        </Modal>
      </ModalPage>
    )
  }
}

export const NewReferralModal = withStyles(styles)(_NewReferralModal)
