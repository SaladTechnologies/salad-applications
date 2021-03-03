import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { StorefrontContentPanel } from './StorefrontContentPanel'

const ColorOptions = {
  Cyan: 'cyan',
  Green: 'green',
  Purple: 'purple',
  Red: 'red',
}

storiesOf('Modules/Storefront/Components', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 50, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('Content Panel - without Image', () => {
    return (
      <StorefrontContentPanel
        body={text(
          'Body',
          "Earn Salad balance by completing tasks such as downloading and playing mobile games. Whether you just want to top off your balance, boost your regular earnings, or can't mine with Salad, offerwalls allow you to make more money.\n\n[Take Me There](/earn/offerwall)",
        )}
        title={text('Heading', 'Offerwalls')}
        // @ts-ignore
        color={select('Color', ColorOptions, ColorOptions.Cyan)}
      />
    )
  })
  .add('Content Panel - Image Left', () => {
    return (
      <StorefrontContentPanel
        body={text(
          'Body',
          "Earn Salad balance by completing tasks such as downloading and playing mobile games. Whether you just want to top off your balance, boost your regular earnings, or can't mine with Salad, offerwalls allow you to make more money.\n\n[Take Me There](/earn/offerwall)",
        )}
        title={text('Heading', 'Offerwalls')}
        // @ts-ignore
        color={select('Color', ColorOptions, ColorOptions.Cyan)}
        image="https://app-api.salad.io/api/v1/reward-images/f04c1b2a-40cf-4160-b215-99885760ca81.jpg"
        imagePosition="left"
      />
    )
  })
  .add('Content Panel - Image Right', () => {
    return (
      <StorefrontContentPanel
        body={text(
          'Body',
          "Earn Salad balance by completing tasks such as downloading and playing mobile games. Whether you just want to top off your balance, boost your regular earnings, or can't mine with Salad, offerwalls allow you to make more money.\n\n[Take Me There](/earn/offerwall)",
        )}
        title={text('Heading', 'Offerwalls')}
        // @ts-ignore
        color={select('Color', ColorOptions, ColorOptions.Cyan)}
        image="https://app-api.salad.io/api/v1/reward-images/f04c1b2a-40cf-4160-b215-99885760ca81.jpg"
        imagePosition="right"
      />
    )
  })
  .add('Content Panel - Image Top', () => {
    return (
      <StorefrontContentPanel
        body={text(
          'Body',
          "Earn Salad balance by completing tasks such as downloading and playing mobile games. Whether you just want to top off your balance, boost your regular earnings, or can't mine with Salad, offerwalls allow you to make more money.\n\n[Take Me There](/earn/offerwall)",
        )}
        title={text('Heading', 'Offerwalls')}
        // @ts-ignore
        color={select('Color', ColorOptions, ColorOptions.Cyan)}
        image="https://app-api.salad.io/api/v1/reward-images/f04c1b2a-40cf-4160-b215-99885760ca81.jpg"
        imagePosition="top"
      />
    )
  })
  .add('Content Panel - Image Bottom', () => {
    return (
      <StorefrontContentPanel
        body={text(
          'Body',
          "Earn Salad balance by completing tasks such as downloading and playing mobile games. Whether you just want to top off your balance, boost your regular earnings, or can't mine with Salad, offerwalls allow you to make more money.\n\n[Take Me There](/earn/offerwall)",
        )}
        title={text('Heading', 'Offerwalls')}
        // @ts-ignore
        color={select('Color', ColorOptions, ColorOptions.Cyan)}
        image="https://app-api.salad.io/api/v1/reward-images/f04c1b2a-40cf-4160-b215-99885760ca81.jpg"
        imagePosition="bottom"
      />
    )
  })
