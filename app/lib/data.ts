'use server'


import { Pool } from 'pg';


export async function getTS(pool: Pool, runid: number, sourceId: bigint[], tags: string[]) {

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

export async function getSpectraTS(pool: Pool) {

  try {
    const data = await pool.query(
      `select runname from run where runid = 3852`
     /*  `select sourceid,f.*
        from
        source
        join tsspectra_base t using (sourceid)
        join lateral ts_derived_spec(t.sourceid,spec,'BpRpSpectraCut_BP',3852) f on true
        where
          t.catalogid = getmaincatalog()   and sourceid in (353303941049953920)` */
    );

    return data.rows;
  } catch (err) {

    throw new Error('Failed to load data' + err);
  }
}

export async function getTS_Page(pool: Pool, runid: number, tags: string[], pageIndex: number, pageSize: number) {

  try {
    console.log(`query: select * from ts_derived_page(${tags}::text[],${runid},${pageIndex * pageSize},${pageSize})`)
    const data = await pool.query(
      `select * from ts_derived_page($1::text[],$2,$3,$4)`,
      [tags, runid, pageSize * pageIndex, pageSize]
    );

    return data.rows; // Return the actual data
  } catch (err) {

    throw new Error('Failed to load data' + err);
  }
}


export async function getRun(pool: Pool, offset: Number, size: Number) {


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


export async function getSourceResultsId(pool: Pool, runid: Number, offset: Number, size: Number) {


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
export async function getTimeSeriesResultTypes(pool: Pool, runid: Number) {


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

