import 'react-multi-carousel/lib/styles.css'
export const rewardItemResponsive = {
  desktop: {
    breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 1300 },
    items: 7,
    slidesToSlide: 7,
    partialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1300, min: 900 },
    items: 5,
    slidesToSlide: 5,
    partialVisibilityGutter: 20,
  },
  tabletSmall: {
    breakpoint: { max: 900, min: 500 },
    items: 3,
    slidesToSlide: 3,
    partialVisibilityGutter: 20,
  },
  mobile: {
    breakpoint: { max: 500, min: 0 },
    items: 2,
    slidesToSlide: 2,
    partialVisibilityGutter: 20,
  },
}
