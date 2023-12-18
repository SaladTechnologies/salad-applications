import type { FC } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { DefaultTheme, type SaladTheme } from '../../../SaladTheme'
import { Scrollbar, SmartLink } from '../../../components'
import PixelChoppingSaladImage from '../assets/pixel-chopping-salad.svg'
import SaladEarnOptionsImage from '../assets/salad-earn-options.svg'
import { earnTypes } from './constants'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '80px',
    padding: '120px 230px 150px',
    color: theme.white,
    fontFamily: theme.fontMallory,
    justifyContent: 'center',

    '@media screen and (max-width: 1440px)': {
      padding: '120px 80px 150px',
    },
    '@media screen and (max-width: 1024px)': {
      padding: '60px 40px 120px',
    },
  },
  title: {
    fontSize: 32,
    color: theme.green,
    fontWeight: 900,
  },
  descriptiom: {
    fontSize: 16,
    lineHeight: '36px',
  },
  balanceInfoBlock: {
    display: 'flex',
    gap: '80px',
    justifyContent: 'space-between',
  },
  earnTypesBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  earnTypesList: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earnTypeListItem: {
    display: 'flex',
    gap: '16px',
    width: '45%',
    alignItems: 'center',
  },
  earnTypeImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    minHeight: 64,
  },
  earnTypeLabel: {
    maxWidth: 390,
  },
  content: {
    maxWidth: 465,
    minWidth: 375,
  },
  downloadBlock: {
    display: 'flex',
  },
  downloadContent: {
    maxWidth: 465,
  },
  downloadDescriptiom: {
    fontSize: 16,
    lineHeight: '24px',
    margin: '18px 0 33px',
  },
  downloadButtonLink: {
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',
    color: theme.white,
    fontWeight: 700,
    borderRadius: 4,
    border: `2px solid ${theme.darkGreen}`,
    fontSize: 16,
    backgroundColor: theme.darkGreen,
    padding: '8px 75px',
  },
  downloadImage: {
    margin: 'auto',
  },
})

interface Props extends WithStyles<typeof styles> {}

const _EarnInfoPage: FC<Props> = ({ classes }) => {
  return (
    <Scrollbar>
      <div className={classes.container}>
        <div className={classes.balanceInfoBlock}>
          <div className={classes.content}>
            <h2 className={classes.title}>What is Salad Balance?</h2>
            <p className={classes.descriptiom}>
              In exchange for lending us your GPU, CPU or Bandwidth resources Salad will give you balance to spend in
              the Salad store. This can be used to purchase things like Amazon Gift Cards, Steam keys, Discord Nitro,
              and more in the{' '}
              <SmartLink to="/store" color={DefaultTheme.green}>
                Salad Storefront.
              </SmartLink>{' '}
              Salad Balance varies depending on the type of jobs performed on the Salad network, as well as the{' '}
              <SmartLink
                to="https://support.salad.com/article/78-is-my-machine-compatible-with-salad"
                color={DefaultTheme.green}
              >
                quality
              </SmartLink>{' '}
              of your PC.
            </p>
          </div>
          <Img src={SaladEarnOptionsImage} alt="Salad earn options" loader={<Skeleton height="100%" />} />
        </div>
        <div className={classes.earnTypesBlock}>
          <p className={classes.descriptiom}>
            There are four types of jobs your machine can work on the Salad network for Balance
          </p>
          <div className={classes.earnTypesList}>
            {earnTypes.map(({ title, description, imageSrc }) => (
              <div className={classes.earnTypeListItem}>
                <div className={classes.earnTypeImage}>
                  <img src={imageSrc} alt={title} />
                </div>
                <p className={classes.earnTypeLabel}>
                  <b>{title}</b> {description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.downloadBlock}>
          <div className={classes.content}>
            <h2 className={classes.title}>How do I earn salad Balance?</h2>
            <p className={classes.downloadDescriptiom}>
              All you have to do is download the Salad widget and start chopping! For more information on how to get
              started, check out this{' '}
              <SmartLink
                to="https://support.salad.com/article/135-getting-started-with-salad-the-basics"
                color={DefaultTheme.green}
              >
                guide
              </SmartLink>{' '}
              .
            </p>
            <a href="/download" className={classes.downloadButtonLink}>
              Download Salad
            </a>
          </div>
          <Img
            className={classes.downloadImage}
            src={PixelChoppingSaladImage}
            alt="Salad chopping pixel"
            loader={<Skeleton height="100%" />}
          />
        </div>
      </div>
    </Scrollbar>
  )
}

export const EarnInfoPage = withStyles(styles)(_EarnInfoPage)
