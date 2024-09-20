export interface run {
    runid: number,
    runname: string
    size:number
}

export interface source {
    sourceid: number,
}

export interface ts {
    tag: string,
    sourceid: number,
    obstimes: number[],
    vals: number[],
    errs: number[]
}

export interface timeseriestag {
    tag: string,
    bandpass: string,
    domain: string
  }