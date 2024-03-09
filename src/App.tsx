import React, { useEffect, useState } from 'react'
import { getAllRecords } from './utils/supabaseFunctions';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  Td,
} from '@chakra-ui/react'
import { Record } from './domain/record';


function App (){

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  //ここでクラスを使ってあげるってこと？
  const [records, setRecords] = useState<Record[]>([]);
 
  //ひとまずデータ取得のみ
  useEffect(()=>{
    const getRecords = async()=>{
      const record = await getAllRecords()
      setRecords(record)
      console.log(record)
    };
    getRecords();
    
  },[])

  
  return (
    <>
      <h1 color='#f20' >学習記録アプリ</h1>
   
<TableContainer>
  <Table variant='simple'>
    <TableCaption>学習記録</TableCaption>
    <Thead>
      <Tr>
        <Th>学習内容</Th>
        <Th>学習時間</Th>
        <Th isNumeric>日付</Th>
      </Tr>
    </Thead>
    <Tbody>
    {records.map((record) => (
              <Tr key={record.id}>
                <Td>{record.contents}</Td>
                <Td>{record.time}</Td>
                <Td>{record.created_at}</Td>
              </Tr>
            ))}
    </Tbody>

  </Table>
</TableContainer>
    </>
  )
}

export default App;