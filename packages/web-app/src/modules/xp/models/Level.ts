/**
 * Represents a level/veggie
 */
export class Level {
  constructor(
    /** The unique key, must be valid url (ex. red-onion) */
    public readonly key: string,
    /** The display name  */
    public readonly title: string,
    public readonly minXp: number,
    public readonly maxXp: number,
    public readonly color: string,
  ) {}
}
