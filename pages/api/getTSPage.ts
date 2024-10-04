import { getTS, getTS_Page } from '@/app/lib/data';

import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(req.query)


    const runid = req.query.runid;
    const pageSize = req.query.pageSize;
    const pageIndex = req.query.pageIndex;
    
    const tags = Array.isArray(req.query.tags)?req.query.tags as string[]:Array(req.query.tags);


    const data = await getTS_Page(Number(runid), tags, Number(pageIndex),Number(pageSize));
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
}