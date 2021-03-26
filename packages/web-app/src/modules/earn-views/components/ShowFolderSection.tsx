import withStyles, { WithStyles } from 'react-jss'
import { Button, Divider, P, SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    flexDirection: 'column',
    color: theme.lightGreen,
  },
  content: {
    padding: 20,
    color: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  openFolder: () => void
}

const _ShowFolderSection = ({ classes, openFolder }: Props) => {
  return (
    <div className={classes.container}>
      <Divider />
      <SectionHeader>Show Application Log Folder</SectionHeader>
      <div className={classes.content}>
        <P>
          If you're having issues with Salad, our Support team may request that you upload your log files. Press "Show
          Folder", attach both files to your open support ticket, and press "Send".
        </P>
        <Button onClick={openFolder}>Show Folder</Button>
      </div>
    </div>
  )
}

export const ShowFolderSection = withStyles(styles)(_ShowFolderSection)
