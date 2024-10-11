'use server'

import pool from '@/app/lib/db'

export async function getTS(runid: number, sourceId: bigint[], tags: string[]) {

  try {
    const data = await pool.query(
      `select * from ts_derived_batch($1::text[],$2,$3::bigint[])`,
      [tags, runid, sourceId]
    );

    return data.rows; // Return the actual data
  } catch (err) {

    throw new Error('Failed to load data' + err);
  }
}

export async function getTS_Page(runid: number, tags: string[], pageIndex: number, pageSize: number) {

  try {
  console.log( `query: select * from ts_derived_page(${tags}::text[],${runid},${pageIndex*pageSize},${pageSize})`)
    const data = await pool.query(
      `select * from ts_derived_page($1::text[],$2,$3,$4)`,
      [ tags,runid,  pageSize*pageIndex,pageSize]
    );

    return data.rows; // Return the actual data
  } catch (err) {

    throw new Error('Failed to load data' + err);
  }
}


export async function getRun(offset: Number, size: Number) {


  try {

    const data = await pool.query(
      `select runid, runname, size, creationdate,state from run order by 1 desc limit $1 offset $2`,
      [size, offset]
    );
    return data.rows; // Return the actual data
  } catch (err) {
    throw new Error('Failed to load data');
  }


}


export async function getSourceResultsId(runid: Number, offset: Number, size: Number) {


  try {

    const data = await pool.query(
      `select sourceid from dr4_ops_cs48.sourceresult where runid = $1 order by 1 limit $2 offset $3`,
      [runid, size, offset]
    );

    return data.rows; // Return the actual data
  } catch (err) {
    throw new Error('Failed to load data');
  }
}
export async function getTimeSeriesResultTypes(runid: Number) {


  try {

    const data = await pool.query(
      `select tag, bandpass, domain  from timeseriesresulttype where run_runid = $1 order by 1,2`,
      [runid]
    );

    return data.rows; // Return the actual data
  } catch (err) {
    throw new Error('Failed to load data');
  }

}

