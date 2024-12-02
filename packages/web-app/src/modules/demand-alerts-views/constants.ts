import type { CSSObjectWithLabel } from "react-select";
import { DefaultTheme } from "../../SaladTheme";

export const mockedGpuNames = [
  { label: 'NVIDIA RTX 4090', value: 'NVIDIA RTX 4090' },
  { label: 'NVIDIA RTX 4080', value: 'NVIDIA RTX 4080' },
  { label: 'NVIDIA RTX 4070 Ti Super', value: 'NVIDIA RTX 4070 Ti Super' },
]

export const demandScenarios = [
  { label: 'High Demand', value: 'highDemand' },
  { label: 'Moderate Demand', value: 'moderateDemand' },
  { label: 'Low Demand', value: 'lowDemand' },
]

export const customSetUpDropdownStyles = {
  control: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    backgroundColor: DefaultTheme.lightGreen,
    width: '230px',
    borderRadius: 0,
  }),
  menu: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    color: DefaultTheme.darkBlue,
    backgroundColor: DefaultTheme.lightGreen,
  }),
  option: (baseStyles: CSSObjectWithLabel, state: { isSelected: boolean; isFocused: boolean }) => {
    let backgroundColor = DefaultTheme.lightGreen
    if (state.isSelected) {
      backgroundColor = DefaultTheme.darkBlue
    } else if (state.isFocused) {
      backgroundColor = DefaultTheme.green
    }

    return {
      ...baseStyles,
      backgroundColor,
      color: state.isSelected ? DefaultTheme.lightGreen : DefaultTheme.darkBlue,
      cursor: 'pointer',
    }
  },
  singleValue: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    transition: 'opacity 300ms',
    color: DefaultTheme.darkBlue,
  }),
}
