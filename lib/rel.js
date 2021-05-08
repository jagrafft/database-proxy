import { json } from 'micro'
import { parse } from 'url'

import { deleteSource, installSource, relQuery } from './rel-helpers'

export default url => {
  url = parse(url, true)

  return async function query(req, res) {
    const data = await json(req)
          .then((obj) => {
            return ((o) => {
              switch(o.params.cmd) {
                case 'delete_source':
                  return deleteSource(o.params.db, o.params.sourceName);
                case 'install_source':
                  return installSource(o.params.db, o.params.sourceName, o.sql);
                case 'query':
                  return relQuery(o.params.db, o.sql, true, o.params.out);
                default:
                  return { 'ERR': 'Command not recognized'};
              }
            })(obj)
          })
          .then((result) => result)
    
    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {type: "string"},
          cols: {type: "array"},
        }
      }
    }

    return {data, schema}
  }
}
