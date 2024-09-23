export interface run {
    runid: number,
    runname: string,
    size:number,
    state:string;
    creationdate:string
}

export interface source {
    sourceid: BigInt,
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