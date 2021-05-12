import * as raiSdk from 'relationalai-sdk'

const lc = new raiSdk.LocalConnection()

const deleteSource = (db, sourceName) => {
  return new Promise((resolve, reject) => {
    lc.deleteSource(db, sourceName).then((res) => {
      if (res.result.problems.length > 0) {
        // ERROR
        reject(res.result.problems)
      } else {
        // OK
        resolve({ 'SUCCESS': `${sourceName} deleted from ${db}` })
      }
    })
  })
}

const installSource = (db, sourceName, sourceString) => {
  return new Promise((resolve, reject) => {
    lc.installSource(db, sourceName, sourceString).then((res) => {
      if (res.result.problems.length > 0) {
        // ERROR
        reject(res.result.problems)
      } else {
        // OK
        resolve({ 'SUCCESS': `${sourceName} installed to ${db}` })
      }
    })
  })
}

const listSources = (db) => {
  return new Promise((resolve, reject) => {
    lc.listSources(db).then((res) => {
      if (res.result.problems.length > 0) {
        // ERROR
        reject(res.result.problems)
      } else {
        // OK
        resolve(res.result.actions[0].result.sources)
      }
    })
  })
}

const relQuery = (db, qry, bool, out) => {
  return new Promise((resolve, reject) => {
    lc.query(db, qry, bool, out).then((res) => {
      if (res.result.problems.length > 0) {
        // ERROR
        reject(res.result.problems)
      } else {
        // OK
        resolve(res.result.actions[0].result.output.map(x => new Object({ name: x.rel_key.name, cols: x.columns })))
      }
    })
  })
}

export { deleteSource, installSource, listSources, relQuery }
