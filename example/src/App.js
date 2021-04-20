import React, { useState, useEffect } from 'react'

import { Spread, getSheets } from 'spread-eagle'
import 'spread-eagle/dist/index.css'
const App = () => {
  const [sheets, setSheets] = useState()
  useEffect(() => {
    getSheets('16oebHDZ46f7noY1fEn7EaiJ8f1CtxfO0Fd0R2jsODfo').then((res) =>
      setSheets(res)
    )
  }, [])
  return (
    <>
      <Spread sheetName='home' sheets={sheets} />
      <Spread sheetName='test' sheets={sheets} />
    </>
  )
}

export default App
