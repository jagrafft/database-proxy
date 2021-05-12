import { json } from 'micro'
import { parse } from 'url'

import { deleteSource, installSource, listSources, relQuery } from './rel-helpers'

export default url => {
  url = parse(url, true)

  return async function query(req, res) {
    const data = await json(req)
          .then((obj) => {
            return ((o) => {
              switch(o.params.cmd) {
                case 'query':
                  return relQuery(o.params.db, o.sql, true, o.params.out);
                case 'list_sources':
                  return listSources(o.params.db);
                case 'install_source':
                  return installSource(o.params.db, o.params.sourceName, o.sql);
                case 'delete_source':
                  return deleteSource(o.params.db, o.params.sourceName);
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
