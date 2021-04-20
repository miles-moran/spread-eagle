# spread-eagle

> Content Management System via Google Sheet

[![NPM](https://img.shields.io/npm/v/spread-eagle.svg)](https://www.npmjs.com/package/spread-eagle) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install spread-eagle
```

```bash
yarn add spread-eagle
```

## Usage
1. Create a Google Sheet that follows this [structure](https://docs.google.com/spreadsheets/d/16oebHDZ46f7noY1fEn7EaiJ8f1CtxfO0Fd0R2jsODfo/edit#gid=1596527936).
  * A template sheet is mandatory
  * At least one "blueprint" sheet is mandatory 
2. Publish the sheet to the web. 
  * File > Publish to the Web (Entire Document, Web)
3. Pass in the workbook ID via props (bookId) and the corresponding sheet (sheetName)

```jsx
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
    </>
  )
}

export default App

```

## License

MIT © [miles-moran](https://github.com/miles-moran)
