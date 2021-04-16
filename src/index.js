import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { transform } from '@babel/core'
import preset from '@babel/preset-react'
import Loading from './components/Loading'
// import styles from './styles.module.css'
const SpreadEagle = ({ bookId, sheetName }) => {
  const url = `https://spreadsheets.google.com/feeds/worksheets/${bookId}/public/basic?alt=json`
  const [page, setPage] = useState(<Loading />)
  useEffect(() => {
    axios.get(url).then((res) => {
      const sheets = res.data.feed.entry
      const template = sheets.find((sheet) => sheet.title.$t === 'template')
      const home = sheets.find((sheet) => sheet.title.$t === sheetName)
      const templateURL = `${
        template.link.find((l) => l.href.includes('/cells/')).href
      }?alt=json`
      const homeURL = `${
        home.link.find((l) => l.href.includes('/cells/')).href
      }?alt=json`
      axios.get(templateURL).then((templateRes) => {
        const temp = readTemplate(templateRes.data.feed.entry)
        axios.get(homeURL).then((homeRes) => {
          const ho = readBlueprint(homeRes.data.feed.entry, temp)
          setPage(ho)
        })
      })
    })
  }, [])
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
  return <div>{page}</div>
}

export default SpreadEagle
