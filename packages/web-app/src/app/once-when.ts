/**
 * Returns a check that runs `effect` the first time it is called while `condition` holds, and never again: MobX's
 * `when`, run by explicit calls instead of a reaction. Call the check right after each change to what `condition`
 * reads, where the reaction would have run.
 */
export const onceWhen = (condition: () => boolean, effect: () => void): (() => void) => {
  let done = false
  return () => {
    if (done || !condition()) {
      return
    }
    done = true
    effect()
  }
}
