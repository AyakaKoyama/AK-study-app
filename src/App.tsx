import React, { useEffect, useState } from 'react'
import { getAllRecords } from './utils/supabaseFunctions';

const App = () =>{

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [records, setRecords] = useState<any>([]);

  useEffect(()=>{
    const getRecords = async()=>{
      const records = await getAllRecords()
      setRecords(records)
      console.log(records)
    };
    getRecords();
    
  },[])

  return (
    <>
      <h1 color='#f20' >学習記録アプリ</h1>
    </>
  )
}

export default App
