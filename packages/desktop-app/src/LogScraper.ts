export module LogScraper {
  const hashes = ['h', 'Kh', 'Mh', 'Gh', 'Th']

  export let hashrate: number = 0

  export const setHashrateFromLog = (entry: string) => {
    //  The ' m ' I am searching for I assume stands for "mining" and is the only line
    //  we are interested in to set the hashrate
    if (entry.includes(' m ')) {
      const split = entry.toString().split(' ')
      const index = split.findIndex(i => {
        return i === hashes.find(hash => i === hash)
      })

      hashrate = Number(split[index - 1])
    }
  }
}

//#region Sample logs
/*
-- log_37.log - 0.2.0
[2019-08-26 15:28:28.929] [error] stderr:  i 15:28:28 cuda-0   Solution: 0xe53452a54900479a

[2019-08-26 15:28:29.312] [error] stderr:  i 15:28:29 stratum  **Accepted 383 ms. eth-us-west1.nanopool.org [66.42.105.146:9999]

[2019-08-26 15:28:33.660] [error] stderr:  m 15:28:33 main     Speed 25.25 Mh/s gpu0 25.25 [A90+6] Time: 13:58

[2019-08-26 15:28:38.663] [error] stderr:  m 15:28:38 main     Speed 25.25 Mh/s gpu0 25.25 [A90+6] Time: 13:58

[2019-08-26 15:28:42.433] [error] stderr:  i 15:28:42 stratum  Job: #4a4fc8f1... eth-us-west1.nanopool.org [66.42.105.146:9999]

[2019-08-26 15:28:43.666] [error] stderr:  m 15:28:43 main     Speed 24.18 Mh/s gpu0 24.18 [A90+6] Time: 13:58
*/

/*
-- Local log.log - 0.2.1

[2019-08-23 12:42:40.317] [error] stderr:  m 12:42:40 <unknown> 0:41 A17 58.54 Mh - cu0 30.71, cu1 27.83

[2019-08-23 12:42:45.318] [error] stderr:  m 12:42:45 <unknown> 0:41 A17 55.52 Mh - cu0 28.83, cu1 26.69

[2019-08-23 12:42:45.329] [error] stderr:  i 12:42:45 <unknown> Job: 67ceec50... eth-us-west1.nanopool.org [66.42.105.146:9999]

[2019-08-23 12:42:50.318] [error] stderr:  m 12:42:50 <unknown> 0:41 A17 53.01 Mh - cu0 27.52, cu1 25.49

[2019-08-23 12:42:51.323] [info] console:4377:0:Status MachineId: 2C-FD-A1-6F-AC-45
*/

/*
-- log_38.log - 0.2.1
[2019-08-28 23:28:54.673] [error] stderr:  m 23:28:54 <unknown> 0:00 A0 121.56 Kh - cu0 121.56

[2019-08-28 23:37:30.311] [info] console:1:0:Status MachineId: 0A-00-27-00-00-16
[2019-08-28 23:37:34.999] [error] stderr:  m 23:37:34 <unknown> 0:09 A2 19.91 Mh - cu0 19.91

[2019-08-28 23:37:35.949] [error] stderr:  i 23:37:35 <unknown> Job: 8f9de276... eth-us-west1.nanopool.org [66.42.105.146:9999]

[2019-08-28 23:37:38.012] [error] stderr:  i 23:37:38 <unknown> Job: 18c3aa6c... eth-us-west1.nanopool.org [66.42.105.146:9999]

[2019-08-28 23:37:39.999] [error] stderr:  m 23:37:39 <unknown> 0:09 A2 19.83 Mh - cu0 19.83

[2019-08-28 23:37:40.457] [error] stderr:  i 23:37:40 <unknown> Job: a246aae7... eth-us-west1.nanopool.org [66.42.105.146:9999]

[2019-08-28 23:37:45.008] [error] stderr:  m 23:37:45 <unknown> 0:09 A2 19.76 Mh - cu0 19.76
*/
//#endregion