/**
 * Represents a level/veggie
 */
export class Level {
  constructor(
    /** The unique key, must be valid url (ex. red-onion) */
    public readonly key: string,
    public readonly minXp: number,
    public readonly maxXp: number,
  ) {}
}
