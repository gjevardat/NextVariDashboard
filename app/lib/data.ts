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
    const data = await pool.query(
      `with sources as (
select sourceid,catalogid from sourceresult where runid = $1 and catalogid=getmaincatalog() order by 1 offset $3 limit $4
)
 SELECT

                f.sourceid, tag, f.obstimes, f.val, f.valerr, f.transitid
                FROM sources
                JOIN ts g USING(catalogid,sourceid)
                JOIN ts bp USING(catalogid, sourceid)
                JOIN ts rp USING(catalogid, sourceid)
                JOIN ts ccd USING(catalogid, sourceid)
                join lateral unnest($2::text[]) tag on true
                join lateral ts_derived(g.sourceid,g.obstimes,g.transitids,g.vals,g.valserr,g.flags,bp.obstimes,bp.transitids,bp.vals,bp.valserr,bp.flags,
rp.obstimes,rp.transitids,rp.vals,rp.valserr,rp.flags,ccd.obstimes,ccd.transitids,ccd.vals,ccd.valserr,ccd.flags,tag,$1) f on true
        WHERE
              g.ftimeseriestype = gettstypeid('Gaia','GAIA_PHOT_G')
          AND bp.ftimeseriestype = gettstypeid('Gaia','GAIA_PHOT_BP')
          AND rp.ftimeseriestype = gettstypeid('Gaia','GAIA_PHOT_RP')
          AND ccd.ftimeseriestype = gettstypeid('Gaia','GAIA_PHOT_G_CCD')
          AND catalogid=getmaincatalog()`,
      [runid, tags, pageSize*pageIndex,pageSize]
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

