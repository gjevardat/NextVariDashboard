import { getRun } from '@/app/lib/data';

import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req:NextApiRequest , res:NextApiResponse) {
    try {

      const {offset} = req.query;
      const {size} = req.query;
      
      const data = await getRun(Number(offset),Number(size));
         
      res.status(200).json(data);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch data !! something strange' });
    }
  }