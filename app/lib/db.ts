
import { Pool } from "pg";

export const dr3_pool = new Pool({
  user:process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST_DR3,
  port: Number(process.env.DB_PORT_DR3),
  database: process.env.DB_NAME,

});


export const dr4_pool = new Pool({
  user:process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST_DR4,
  port: Number(process.env.DB_PORT_DR4),
  database: process.env.DB_NAME,

});