import React, { useState, useEffect } from 'react'

import SpreadEagle, { getSheets } from 'spread-eagle'
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
      <SpreadEagle sheetName='home' sheets={sheets} />
      <SpreadEagle sheetName='test' sheets={sheets} />
    </>
  )
}

export default App
