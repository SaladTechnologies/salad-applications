import classNames from 'classnames'
import type CSS from 'csstype'
import type { SyntheticEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { type SaladTheme } from '../../SaladTheme'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  '@keyframes disappearing': {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(0)' },
  } as CSS.Properties,
  '@keyframes appearing': {
    '0%': { transform: 'scale(0)' },
    '100%': { transform: 'scale(1)' },
  } as CSS.Properties,
  dropdownWrap: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    zIndex: 1,
  },
  dropdownContent: {
    position: 'relative',
    backgroundColor: theme.darkBlue,
    boxShadow: '0px 0px 1px rgba(27, 29, 34, 0.25), 0px 4px 12px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: '4px',
    border: `1px solid ${theme.lightGreen}`,
  },
  hidden: {
    animation: '$disappearing 200ms ease-in-out forwards',
  },
  shown: {
    animation: '$appearing 300ms ease-in-out forwards',
    transformOrigin: 'top center',
  },
  dropdownOptionWrap: {
    width: '100%',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  dropdownOptionContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0px 8px 0px 8px',
    '&:hover': {
      backgroundColor: theme.lightGreen,
      color: theme.darkBlue,
    },
    '&.selected': {
      backgroundColor: theme.darkGreen,
    },
  },
  selected: {
    backgroundColor: theme.darkGreen,
  },
  toggleDropdown: {
    cursor: 'pointer',
  },
})

enum AnimationType {
  appearing,
  disappearing,
}

export interface DropdownOption<T = void> {
  value?: T
  displayName?: string
  content?: JSX.Element
  shown?: boolean
  handler?: (option?: DropdownOption<T>) => void | undefined
}

export interface Props<TOptionValue> extends WithStyles<typeof styles> {
  options?: DropdownOption<TOptionValue>[]
  content?: JSX.Element
  toggleContent?: JSX.Element
  wrapClassname?: string
  isDropdownShown?: boolean
  setDropdownShown?: (value: boolean) => void
  optionKey?: keyof DropdownOption
}

const _Dropdown = <TOptionValue,>({
  options,
  content,
  toggleContent,
  wrapClassname,
  isDropdownShown: isDropdownShownExternal,
  setDropdownShown: setDropdownShownExternal,
  optionKey,
  classes,
}: Props<TOptionValue>): React.ReactElement => {
  if (
    (setDropdownShownExternal === undefined && isDropdownShownExternal) ||
    (setDropdownShownExternal && isDropdownShownExternal === undefined)
  ) {
    throw new Error(
      'Dropdown: You should provide both "isDropdownShown" and "setDropdownShown" props in case of external state usage',
    )
  }

  if ((optionKey === undefined && options) || (optionKey && options === undefined)) {
    throw new Error(
      'Dropdown: You should provide both "options" and "optionKey" props in case passing options instead of content',
    )
  }

  const [isDropdownShown, setDropdownShown] = useState(isDropdownShownExternal)
  const [animationType, setAnimationType] = useState(AnimationType.disappearing)
  const dropdownRef = useRef<null | HTMLDivElement>(null)
  const toggleDropdownRef = useRef<null | HTMLElement>(null)

  useEffect(() => {
    if (isDropdownShownExternal !== undefined) {
      setAnimationType(isDropdownShownExternal ? AnimationType.appearing : AnimationType.disappearing)
      setDropdownShown(isDropdownShownExternal)
    }
  }, [isDropdownShownExternal])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target !== toggleDropdownRef.current)
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setAnimationType(AnimationType.disappearing)
        }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  const toggleDropdown = (event: SyntheticEvent) => {
    event.stopPropagation()
    toggleDropdownRef.current = event.target as HTMLElement
    if (!isDropdownShown) {
      setDropdownShownExternal ? setDropdownShownExternal(true) : setDropdownShown(true)
      setAnimationType(AnimationType.appearing)
    } else {
      setAnimationType(AnimationType.disappearing)
    }
  }

  const onAnimationEnd = () => {
    if (animationType === AnimationType.disappearing) {
      setDropdownShownExternal ? setDropdownShownExternal(false) : setDropdownShown(false)
    }
  }

  const onOptionClick = (option: DropdownOption<TOptionValue>) => {
    setAnimationType(AnimationType.disappearing)
    option.handler?.(option)
  }

  const getDropdownContent = () => {
    if (content) {
      return content
    }

    if (options && optionKey) {
      return options
        .filter((option) => option.shown === undefined || option.shown)
        .map((option) => {
          if (typeof option[optionKey] !== 'string') {
            throw new Error('Dropdown: optionKey props should point the unique string value to use as key')
          }

          return (
            option.content ?? (
              <div
                className={classes.dropdownOptionWrap}
                key={option[optionKey] as string}
                onClick={() => onOptionClick(option)}
              >
                <div className={classNames(classes.dropdownOptionContent)}>
                  <small>{option.displayName}</small>
                </div>
              </div>
            )
          )
        })
    }

    return null
  }

  return (
    <>
      <div className={classes.toggleDropdown} onClick={toggleDropdown}>
        {toggleContent}
      </div>
      {isDropdownShown && (
        <>
          <div
            className={classNames(
              classes.dropdownWrap,
              animationType === AnimationType.appearing ? classes.shown : classes.hidden,
              wrapClassname,
            )}
            ref={dropdownRef}
            onAnimationEnd={onAnimationEnd}
          >
            <div className={classes.dropdownContent}>{getDropdownContent()}</div>
          </div>
        </>
      )}
    </>
  )
}

export const Dropdown = withStyles(styles)(_Dropdown)
