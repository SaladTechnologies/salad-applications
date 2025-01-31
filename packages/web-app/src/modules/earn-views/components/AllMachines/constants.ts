export enum MachinesTableDropdownOptionValue {
  SelectAll = 'Select All',
  SelectAllInPage = 'Select All In Page',
  DeselectAll = 'Deselect All',
  DeselectAllInPage = 'Deselect All In Page',
}

export const machinesTableDropdownOptions = [
  {
    value: MachinesTableDropdownOptionValue.SelectAll,
    label: 'Select All',
  },
  {
    value: MachinesTableDropdownOptionValue.SelectAllInPage,
    label: 'Select All In Page',
  },
  {
    value: MachinesTableDropdownOptionValue.DeselectAll,
    label: 'Deselect All',
  },
  {
    value: MachinesTableDropdownOptionValue.DeselectAllInPage,
    label: 'Deselect All In Page',
  },
]
