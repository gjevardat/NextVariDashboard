import { getTS, getTS_Page } from '@/app/lib/data';

import type { NextApiRequest, NextApiResponse } from 'next'

import { dr4_pool,dr3_pool } from '@/app/lib/db';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(req.query)

    const db = req.query.db;
    
    const pool = db==('dr4')?dr4_pool:db==('dr3')?dr3_pool:null;
    if(pool==null){
      throw Error("Wrong database selected");
    }
    const runid = req.query.runid;
    const pageSize = req.query.pageSize;
    const pageIndex = req.query.pageIndex;
    const tags = Array.isArray(req.query.tags)?req.query.tags as string[]:Array(req.query.tags);
    
    const data = await getTS_Page(pool, Number(runid), tags.filter(t => t!== undefined), Number(pageIndex),Number(pageSize));
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
}