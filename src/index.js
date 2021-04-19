import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { transform } from '@babel/core'
import preset from '@babel/preset-react'
import Loading from './components/Loading'
// import styles from './styles.module.css'

export const getSheets = (bookId) => {
  const url = `https://spreadsheets.google.com/feeds/worksheets/${bookId}/public/basic?alt=json`
  return axios.get(url).then((res) => {
    const links = []
    res.data.feed.entry.forEach((r) =>
      links.push(
        `${r.link.find((l) => l.href.includes('/cells/')).href}?alt=json`
      )
    )
    const promises = links.map((l) => axios.get(l).then((a) => a.data.feed))
    return Promise.all(promises)
  })
}

const SpreadEagle = ({ sheets, sheetName }) => {
  const [page, setPage] = useState(<Loading />)
  const [loaded, setLoaded] = useState(false)


  const readBlueprint = (entries, template) => {
    console.log(template)
    console.log('reading blueprint')
    const children = []
    let args = {}
    let elementType = null
    let key = ''
    entries.forEach((entry) => {
      const cord = entry.title.$t
      const row = cord.slice(1 - cord.length)
      const column = cord[0]
      const text = entry.content.$t
      if (column === 'A') {
        if (!elementType) {
          elementType = template[text]
        } else {
          const raw = elementType.code
          const code = transform(raw, { presets: [[preset]] }).code
          const func = new Function('React', `return ${code}`)
          const Component = func(React)
          const element = <Component args={args} />
          children.push(element)
          elementType = template[text]
          args = {}
        }
      }
      if (column === 'B') {
        key = text
      }
      if (column === 'C') {
        args[key] = text
      }
    })
    const raw = elementType.code
    const code = transform(raw, { presets: [[preset]] }).code
    const func = new Function('React', `return ${code}`)
    const Component = func(React)
    const element = <Component args={args} />
    children.push(element)
    console.log(children)
    return children
  }

  const readTemplate = (entries) => {
    console.log(entries)
    console.log('reading template')
    const header = {}
    const rows = {}
    entries.forEach((entry) => {
      const cord = entry.title.$t
      const row = cord.slice(1 - cord.length)
      const column = cord[0]
      const text = entry.content.$t
      if (row === '1') {
        header[column] = text
      } else {
        if (!rows[row]) {
          rows[row] = {}
        }
        rows[row][header[column]] = text
      }
    })
    const elements = {}
    Object.values(rows).forEach((row) => {
      elements[row['keyword']] = row
    })
    return elements
  }

  
  //this is what is funky
  if (!sheets) {  
    return page
  } else {
    if (!loaded) {
      setLoaded(true)
      const dict = {}
      sheets.forEach((sheet) => (dict[sheet.title.$t] = sheet))
      const template = readTemplate(dict['template'].entry)
      const sheet = readBlueprint(dict[sheetName].entry, template)
      setPage(sheet)
    }
  }

  return <div>{page}</div>
}

export default SpreadEagle
