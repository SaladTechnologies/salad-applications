import type { FC } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import type { SaladTheme } from '../../../SaladTheme'
import { Scrollbar } from '../../../components'
import BandwidthImage from '../assets/bandwidth.svg'
import ContainerWorkloadsImage from '../assets/container-workloads.svg'
import CPUImage from '../assets/cpu.svg'
import GPUImage from '../assets/gpu.svg'
import PixelChoppingSaladImage from '../assets/pixel-chopping-salad.svg'
import SaladEarnOptionsImage from '../assets/salad-earn-options.svg'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '80px',
    padding: '120px 230px 150px',
    color: theme.neutral,
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
    color: theme.neutral,
    fontWeight: 700,
    borderRadius: 4,
    border: `2px solid ${theme.darkGreen}`,
    fontSize: 16,
    backgroundColor: theme.darkGreen,
    padding: '8px 75px',
  },
  link: {
    color: theme.green,
  },
  downloadImage: {
    margin: 'auto',
  },
})

const earnTypes = [
  {
    title: 'Container Workloads,',
    description:
      'our most profitable workloads, require more intensive GPU resources. At this time, only newer NVIDIA GPUs are eligible for these workloads.',
    imageSrc: ContainerWorkloadsImage,
  },
  {
    title: 'GPU Mining Workloads,',
    description:
      'unlike the other workloads, are always available to chefs. Payouts are consistent with the current crypto market.',
    imageSrc: GPUImage,
  },
  {
    title: 'CPU Container Workloads',
    description: 'use your CPU to run containerized jobs on your PC.',
    imageSrc: CPUImage,
  },
  {
    title: 'Bandwidth Sharing.',
    description: 'Chefs can safely share their bandwidth with Salad to run streaming services across the globe.',
    imageSrc: BandwidthImage,
  },
]

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
              <Link to="/store" className={classes.link}>
                Salad Storefront.
              </Link>{' '}
              Salad Balance varies depending on the type of jobs performed on the Salad network, as well as the{' '}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://support.salad.com/article/78-is-my-machine-compatible-with-salad"
                className={classes.link}
              >
                quality
              </a>{' '}
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
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://support.salad.com/article/135-getting-started-with-salad-the-basics"
                className={classes.link}
              >
                guide
              </a>{' '}
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
