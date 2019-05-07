const Influx = require('influx')

const influxDbServer = new Influx.InfluxDB({
  host: localhost,
  database: nsk,
  schema: [
    {
      measurement: 'treasures',
      fields: {
        value: Influx.FieldType.STRING
      },
      tags: [
        'captain_id'
      ]
    }
  ]
})

/*

influx.writePoints([
  {
    measurement: 'response_times',
    tags: { host: os.hostname() },
    fields: { duration, path: req.path },
  }
]).then(() => {
  return influx.query(`
    select * from response_times
    where host = ${Influx.escape.stringLit(os.hostname())}
    order by time desc
    limit 10
  `)
}).then(rows => {
  rows.forEach(row => console.log(`A request to ${row.path} took ${row.duration}ms`))
})
 */

module.exports = influxDbServer
