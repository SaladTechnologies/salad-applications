export interface IPersistentStore {
  /**
   * Return the data to persist
   */
  getSavedData(): object

  /**
   * Process the loaded data
   * @param data The persistent data that was loaded
   */
  onDataLoaded(data: object): void
}
