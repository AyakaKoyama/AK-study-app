import React, { useEffect, useState } from 'react'
import { addAllRecords, getAllRecords } from './utils/supabaseFunctions';
import {
  Table,Thead,Tbody,Tr,Th,TableCaption,TableContainer,Td, Spinner,  useDisclosure, Button, } from '@chakra-ui/react'
import { Record } from './domain/record';
import { ModalDetail } from './Props/ModalDetail';


function App (){

  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [studyContent, setStudyContent]=useState(``);
  const [studyTime, setStudyTime]=useState(0);
  
  
  
  //ひとまずデータ取得のみ
  useEffect(()=>{
    const getRecords = async()=>{
      try {
        const record = await getAllRecords();
        setRecords(record);
        console.log(record);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      } finally {
        setLoading(false); // ローディングを非表示にする
      }
    };
    getRecords();
  }, []);

  //登録ボタン押したらモーダル表示
  const onClickAdd = ()=> onOpen()

  //登録ボタン押下
  const onAddRecord = async () => {
    if (!studyTime && !studyContent) {
      return;
    }

    if (studyContent === "") {
      return;
    }
    if (!studyTime) {
      return;
    }
    //データ追加(supabase)
    try {
      const data = await addAllRecords(studyContent, studyTime);
      const newRecord = { id: data.id, studyContent: studyContent, studyTime: studyTime,createDate:data.created_at };
      setRecords([...records, newRecord]);
      setStudyContent("");
      setStudyTime(0);
      onClose(); // モーダルを閉じる
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const onChangeStudyContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputContent = event.target.value;
    setStudyContent(inputContent);
  };
  const onChangeStudyTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const time = parseInt(inputValue); // 数値に変換
    console.log(time)
  if (!isNaN(time)) { // time が NaN でないことを確認
    setStudyTime(time); // studyTime ステートを更新
  } else {
   console.log(time)
  }
  };
  
  return (
    <>
      <h1 color='#f20' >学習記録アプリ</h1>
      {loading && <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />} 
      <Button onClick={onClickAdd}>登録</Button>
<TableContainer>
  <Table variant='simple'>
    <TableCaption>学習記録</TableCaption>
    <Thead>
      <Tr>
        <Th>学習内容</Th>
        <Th>学習時間</Th>
        <Th>日付</Th>
      </Tr>
    </Thead>
    <Tbody>
    {records.map((record) => (
              <Tr key={record.id}>
                <Td>{record.studyContent}</Td>
                <Td>{record.studyTime}</Td>
                <Td>{record.createDate}</Td>
              </Tr>
            ))}
    </Tbody>

  </Table>
</TableContainer>
<ModalDetail isOpen = {isOpen} onClose = {onClose} onAddRecord={onAddRecord}
onChangeStudyContent={onChangeStudyContent} studyContent={studyContent} onChangeStudyTime={onChangeStudyTime} studyTime={studyTime}/>
    </>
  )
}

export default App;