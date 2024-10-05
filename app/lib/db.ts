
import { Pool } from "pg";

const pool = new Pool({
  user:'jevardat_local',
  password: '!jevardat_local!',
  host: 'localhost',
  port: 55434,
  database: 'surveys',

});




export default pool ;