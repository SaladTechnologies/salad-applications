const calculatePercentage = (
  basePercentage: number,
  totalPercentageOfBucket: number,
  totalTimeOfBucket: number,
  baseTime: number,
  runningTime: number,
) => {
  const deltaTime = runningTime - baseTime
  const deltaPercentage = deltaTime * (totalPercentageOfBucket / totalTimeOfBucket)
  return basePercentage + deltaPercentage
}

export const getPreppingPercentage = (runningTime?: number): number => {
  if (runningTime) {
    const buckets = [
      { startAt: 1800000, percentage: 0 }, // startsAt 30 Minutes
      { startAt: 1500000, percentage: 3 }, // startsAt 25 Minutes
      { startAt: 1200000, percentage: 6 }, // startsAt 20 Minutes
      { startAt: 900000, percentage: 12 }, // startsAt 15 Minutes
      { startAt: 600000, percentage: 12 }, // startsAt 10 Minutes
      { startAt: 300000, percentage: 30 }, // startsAt 5 Minutes
      { startAt: 60000, percentage: 12 }, // startsAt 1 Minute
      { startAt: 30000, percentage: 6 }, // startsAt 30 Seconds
      { startAt: 10000, percentage: 5 }, // startsAt 10 Seconds
      { startAt: 0, percentage: 10 },
    ]

    const bucketId = buckets.findIndex((bucket) => bucket.startAt < runningTime)

    if (bucketId === 0) {
      return buckets.reduce((a, b) => a + b['percentage'], 0)
    } else {
      const baseTime = buckets[bucketId - 1].startAt
      const totalTimeOfBucket = buckets[bucketId - 1].startAt - buckets[bucketId].startAt

      const bucketsLength = buckets.length
      const basePercentage = buckets
        .slice()
        .reverse()
        .slice(0, bucketsLength - bucketId)
        .reduce((a, b) => a + b['percentage'], 0)

      const totalPercentageOfBucket = buckets[bucketId].percentage

      return calculatePercentage(basePercentage, totalPercentageOfBucket, totalTimeOfBucket, baseTime, runningTime)
    }
  } else {
    return 0
  }
}
