
import { Pool } from "pg";

const conn = new Pool({
  user:'jevardat_local',
  password: '!jevardat_local!',
  host: 'localhost',
  port: 55434,
  database: 'surveys',

});


export default conn ;