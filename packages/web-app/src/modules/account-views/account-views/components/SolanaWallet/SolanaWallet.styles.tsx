import type CSS from 'csstype'

export const styles: () => Record<string, CSS.Properties> = () => ({
  solanaWalletWrapper: {
    flex: 1,
    marginTop: '56px',
    maxWidth: '400px',
  },
  description: {
    paddingTop: '16px',
  },
  content: {
    paddingTop: '24px',
    width: '100%',
  },
  fieldContainer: {
    maxWidth: '400px',
  },
  savedAddressLabel: {
    paddingBottom: '4px',
  },
  savedAddressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '12px',
  },
  savedAddress: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  copyIcon: {
    cursor: 'pointer',
  },
  buttonRow: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
  },
  messageWrapper: {
    marginTop: '16px',
    minHeight: '40px',
  },
  confirmWrapper: {
    marginTop: '16px',
  },
  confirmText: {
    paddingBottom: '12px',
  },
})
