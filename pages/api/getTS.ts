import { getTS } from '@/app/lib/data';

import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req:NextApiRequest , res:NextApiResponse) {
    try {
      console.log(req.query)
      const {runid,sourceId,tags} = req.query;
      
      
      
      const safeSourceId = Array.isArray(sourceId) 
  ? (sourceId.length > 0 ? BigInt(parseInt(sourceId[0], 10)) : null) // Handle arrays
  : (sourceId ? BigInt(parseInt(sourceId, 10)) : null);  // Handle string or null

      if(safeSourceId!==null){

        const data = await getTS(Number(runid),safeSourceId,tags);
        res.status(200).json(data);
      }
      else{
        res.status(500).json({ error: `cannot parse sourceid : $sourceId`});
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }