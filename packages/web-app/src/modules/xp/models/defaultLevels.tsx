import { Level } from './Level'

// export const defaultLevels = [
//   new Level('carrot', 'Carrot', 0, 20),
//   new Level('lettuce', 'Lettuce', 20, 50),
//   new Level('tomato', 'Tomato', 50, 100),
//   new Level('cucumber', 'Cucumber', 100, 1000),
//   new Level('beet', 'Beet', 1000, 5000),
//   new Level('spinach', 'Spinach', 5000, 10000),
//   new Level('mushroom', 'Mushroom', 10000, 20000),
//   new Level('red-pepper', 'Red Pepper', 20000, 30000),
//   new Level('avocado', 'Avocado', 30000, 50000),
//   new Level('red-onion', 'Red Onion', 50000, 75000),
//   new Level('olives', 'Olives', 75000, 100000),
//   new Level('broccoli', 'Broccoli', 100000, 150000),
//   new Level('blue-cheese', 'Blue Cheese', 150000, 250000),
// ]

const veggies = [
  'carrot',
  'lettuce',
  'tomato',
  'cucumber',
  'beet',
  'spinach',
  'mushroom',
  'red-pepper',
  'avocado',
  'red-onion',
  'olives',
  'broccoli',
  'blue-cheese',
  'egg',
  'apple',
  'kale',
  'eggplant',
  'green-jello',
]

/**
 * Polynomial curve factor. Determined using goalseek to set total xp required for all veggies.
 * Currently  131,400 (~91 days or 1 quarter of the year)
 * Should be modified in conjunction with `linearFactor`
 */
const curveFactor = 3.529964328
export const totalXpRequiredForAllVegies = 131400

/**
 * Linear factor. Ensures that the polynomial curve is not too flat initially.
 * Should be modified in conjunction with `curveFactor`
 */
const linearFactor = 60

export const defaultLevels = (): Level[] => {
  const levels: Level[] = []

  let prevXp = 0

  for (let i = 1; i < veggies.length + 1; ++i) {
    //Calculates the total xp required for this level
    const xp = i * linearFactor + i ** curveFactor

    //Calculates the maximum xp for the level
    const maxXp = Math.round((prevXp + xp) / 60.0) * 60.0
    const lvl = new Level(veggies[i - 1]!, prevXp, maxXp)
    levels.push(lvl)
    prevXp = maxXp
  }

  return levels
}
