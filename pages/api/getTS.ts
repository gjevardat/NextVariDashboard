import { getTS } from '@/app/lib/data';

import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req:NextApiRequest , res:NextApiResponse) {
    try {
      console.log(req.query)
      const {runid,sourceId,tags} = req.query;
      const safeSourceId = sourceId !== undefined ? BigInt(sourceId) : 0 ;

      const data = await getTS(Number(runid),BigInt(safeSourceId),String(tags));
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }