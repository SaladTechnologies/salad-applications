import { observable, action, flow } from 'mobx'
import { Config } from '../../config'
// import { RootStore } from '../../Store'

// Packages
import { AxiosInstance } from 'axios'
import semver from 'semver'

export class DownloadLatestStore {
  //-- Private
  // private releasePath: string = 'https://salad-app-releases.s3.us-east-2.amazonaws.com/latest.yml'

  //-- Observables
  @observable
  public configVersion: string = ''

  @observable
  public awsVersion: string = ''

  @observable
  public showDownloadButton: boolean = false

  @observable
  public downloadPath: string = ''

  constructor(private readonly axios: AxiosInstance) {}

  @action.bound
  checkVersion = flow(function*(this: DownloadLatestStore) {
    try {
      this.awsVersion = '0.3.6'
      this.configVersion = Config.appVersion
      this.showDownloadButton = semver.gt(this.awsVersion, this.configVersion)

      if (this.showDownloadButton) {
        this.downloadPath = `https://salad-app-releases.s3.us-east-2.amazonaws.com/Salad Setup ${this.awsVersion}.exe`
      }

      console.log('===== [[DownloadLatestStore] checkVersion] =====')
      let file = yield this.axios.get('https://salad-app-releases.s3.us-east-2.amazonaws.com/latest.yml')
      console.log('===== [[DownloadLatestStore] checkVersion] file: ', file)
    } catch (error) {
      console.log('--- yaml error: ', error)
    }
  })
}
