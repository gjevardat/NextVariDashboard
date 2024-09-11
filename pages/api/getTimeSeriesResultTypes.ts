import { getSourceResultsId, getTimeSeriesResultTypes } from '@/app/lib/data';

import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req:NextApiRequest , res:NextApiResponse) {
    try {

      const {runid} = req.query;
      const {offset} = req.query;
      const {size} = req.query;
      
      console.log(req.query)
      const data = await getTimeSeriesResultTypes(Number(runid));
         
      res.status(200).json(data);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch data !! something strange' });
    }
  }