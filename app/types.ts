export interface run {
    runid: number,
    runname: string,
    size:number,
    state:string;
    creationdate:string
}

export interface source {
    sourceid: bigint, 
    timeseries: ts[]
}

export interface ts {
    sourceid: bigint,
    tag: string,
    obstimes: number[],
    val: number[],
    valerr: number[],
    transit:bigint[]
}

export interface timeseriestag {
    tag: string,
    bandpass: string,
    domain: string
  }