import type { CSSObjectWithLabel } from "react-select";
import { DefaultTheme } from "../../SaladTheme";

export const mockedGpuNames = [
  { label: 'NVIDIA RTX 4090', value: 'NVIDIA RTX 4090' },
  { label: 'NVIDIA RTX 4080', value: 'NVIDIA RTX 4080' },
  { label: 'NVIDIA RTX 4070 Ti Super', value: 'NVIDIA RTX 4070 Ti Super' },
]

export const demandScenarios = [
  { label: 'Low Demand', value: 'lowDemand' },
  { label: 'Moderate Demand', value: 'moderateDemand' },
  { label: 'High Demand', value: 'highDemand' },
]

export const customDropdownStyles = {
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: DefaultTheme.lightGreen,
    width: '230px',
    borderRadius: 0,
  }),
  menu: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: DefaultTheme.darkBlue,
    backgroundColor: DefaultTheme.lightGreen,
  }),
  option: (provided: CSSObjectWithLabel, state: { isSelected: boolean; isFocused: boolean }) => {
    let backgroundColor = DefaultTheme.lightGreen
    if (state.isSelected) {
      backgroundColor = DefaultTheme.darkBlue
    } else if (state.isFocused) {
      backgroundColor = DefaultTheme.green
    }

    return {
      ...provided,
      backgroundColor,
      color: state.isSelected ? DefaultTheme.lightGreen : DefaultTheme.darkBlue,
      cursor: 'pointer',
    }
  },
  singleValue: (provided: CSSObjectWithLabel) => ({
    ...provided,
    transition: 'opacity 300ms',
    color: DefaultTheme.darkBlue,
  }),
}
