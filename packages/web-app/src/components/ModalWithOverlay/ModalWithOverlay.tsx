import { X } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import type { FC } from 'react'
import { useRef } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useDetectClickOutsideElement } from '../../hooks/useDetectClickOutsideElement'
import type { SaladTheme } from '../../SaladTheme'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  modalOverlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 1000000000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000070',
    fontFamily: 'Mallory',
    top: '0px',
    left: '0px',
  },
  modalContainer: {
    position: 'relative',
    backgroundColor: theme.darkBlue,
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  closeIcon: {
    position: 'absolute',
    right: '16px',
    top: '16px',
    color: '#DBF1C1',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
})

interface Props extends WithStyles<typeof styles> {
  onCloseClick: () => void
  children: JSX.Element
}

const _ModalWithOverlay: FC<Props> = ({ classes, onCloseClick, children }) => {
  const modalContainerRef = useRef(null)

  useDetectClickOutsideElement(modalContainerRef, onCloseClick)

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContainer} ref={modalContainerRef}>
        {children}
        <X className={classes.closeIcon} onClick={onCloseClick} />
      </div>
    </div>
  )
}

export const ModalWithOverlay = withStyles(styles)(_ModalWithOverlay)
