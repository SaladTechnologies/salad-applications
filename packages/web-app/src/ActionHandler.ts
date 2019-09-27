import { Component } from 'react'

export interface ActionState {
  submitting: boolean
  errorMessage?: string
}

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
