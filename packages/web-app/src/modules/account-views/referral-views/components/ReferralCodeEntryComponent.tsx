import { Component } from 'react'
import { Field, Form } from 'react-final-form'
import withStyles, { WithStyles } from 'react-jss'
import { Button, ErrorText, TextField } from '../../../../components'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: 'inherit',
  },
  input: {
    width: 300,
  },
  buttonContainer: {
    display: 'flex',
    height: 47,
  },
}

interface Props extends WithStyles<typeof styles> {
  onSubmitCode?: (code: string) => Promise<void>
}

interface State {
  submitting: boolean
  errorMessage?: string
}

interface FormTypes {
  code?: string
}

class _ReferralCodeEntryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      submitting: false,
    }
  }

  onSubmit = async (values: {}) => {
    const { onSubmitCode } = this.props
    let v = values as FormTypes
    this.setState({ errorMessage: undefined })
    this.validate(v.code)
    if (this.state.errorMessage) return
    if (onSubmitCode && v.code) {
      this.setState({ submitting: true, errorMessage: undefined })
      try {
        await onSubmitCode(v.code)
        this.setState({ submitting: false })
      } catch (e) {
        if (e instanceof Error) {
          this.setState({ submitting: false, errorMessage: e.message })
        }
      }
    }
  }

  validate = (code: string | undefined) => {
    if (code === undefined || code.length === 0) {
      this.setState({ errorMessage: 'Invalid Code' })
    } else if (/\s/g.test(code)) {
      this.setState({ errorMessage: 'Whitespace not allowed' })
    } else if (code.length > 10) {
      this.setState({ errorMessage: 'Code is too long' })
    }
  }

  render() {
    const { classes } = this.props
    const { submitting, errorMessage } = this.state

    return (
      <Form
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Field name="code">
                {({ input, meta }) => (
                  <div className={classes.container}>
                    <TextField
                      className={classes.input}
                      {...input}
                      placeholder="Code"
                      errorText={meta.error && meta.touched && meta.error}
                    />
                    <div className={classes.buttonContainer}>
                      <Button type="submit" uppercase loading={submitting} disabled={submitting}>
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </Field>
              {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            </form>
          )
        }}
      />
    )
  }
}

export const ReferralCodeEntryComponent = withStyles(styles)(_ReferralCodeEntryComponent)
