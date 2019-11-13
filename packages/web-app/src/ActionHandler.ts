import { Component } from 'react'


export interface ActionState {
  /** Submitting is the state of your component while the action is being processed*/
  submitting: boolean
  /** errorMessage is the where the error message will be set if your action fails */
  errorMessage?: string
}

/** submitAction is an easier way of setting your component to a submitting state, and pass error messages */
// without having to write all of the code over and over again

/** func is your action you would like to be processed, component is the component that you are passing func
in from.*/
export const submitAction = async (component: Component, func: () => void) => {
  if (!func || !component) return

  component.setState({ submitting: true, errorMessage: undefined })
  try {
    await func()
  } catch (e) {
    if (e instanceof Error) {
      component.setState({ errorMessage: e.message })
    }
  } finally {
    component.setState({ submitting: false })
  }
}