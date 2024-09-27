import { getTS } from '@/app/lib/data';

import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req:NextApiRequest , res:NextApiResponse) {
    try {
      console.log(req.query)
      
      
      const runid = req.query.runid;
      const sourceids = req.query.sourceids as string[]
      const sourceids_bigint:bigint[] = sourceids.map(s => BigInt(s));
      const tags = req.query.tags as string[];

      if(sourceids_bigint!==null && tags!==null){
        const data = await getTS(Number(runid),sourceids_bigint,tags);
        res.status(200).json(data);
      }
      else{
        res.status(500).json({ error: `cannot parse sourceid : $sourceId`});
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }