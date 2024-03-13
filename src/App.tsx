import React, { useEffect, useState } from 'react'
import { addAllRecords, getAllRecords } from './utils/supabaseFunctions';
import {Modal, ModalOverlay, ModalContent,  ModalHeader, ModalCloseButton, ModalBody, Stack, FormControl, FormLabel, Input, ModalFooter,
  Table,Thead,Tbody,Tr,Th,TableCaption,TableContainer,Td, Spinner,  useDisclosure, Button, } from '@chakra-ui/react'
import { Record } from './domain/record';
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  studyContent: string
  studyTime: number
}



function App (){

  const { register, formState: { errors }, handleSubmit } = useForm<IFormInputs>();
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

  //エラー表示
  const onSubmit: SubmitHandler<IFormInputs> = async data => {
    console.log(data); // フォームデータをログに出力
    try {
      if (!data.studyContent && data.studyTime===0) {
        console.log(data.studyTime)
        throw new Error('内容と時間の入力は必須です');
      }
     //データ追加(supabase)
    const addedData = await addAllRecords(data.studyContent, data.studyTime);
    const newRecord = { id: addedData.id, studyContent: data.studyContent, studyTime: data.studyTime, createDate: addedData.created_at };
    setRecords([...records, newRecord]);
    setStudyContent("");
    setStudyTime(0);
    onClose(); // モーダルを閉じる
    } catch (error) {
      // エラーメッセージを表示
      console.error('Failed to submit form data:', error);
    }
  };

  

  const onChangeStudyContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputContent = event.target.value;
    setStudyContent(inputContent);
  };
  const onChangeStudyTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) { // 入力値が数値であることを確認
      const time = parseInt(inputValue); // 数値に変換
      if (time > 0) { // 0以外の場合のみ設定
        setStudyTime(time);
      } else {
        setStudyTime(0); // 負の値の場合は0に設定
      }
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

<Modal isOpen = {isOpen} onClose = {onClose} autoFocus={false} motionPreset='slideInBottom'>
  <ModalOverlay>
    <ModalContent pb={6}>
      <ModalHeader>学習記録</ModalHeader>
      <ModalCloseButton/>
      <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody mx={4}>
        <Stack spacing ={4}>
          <FormControl>
            <FormLabel>学習内容</FormLabel>
            <Input {...register("studyContent", { required: true })} value={studyContent}  onChange={onChangeStudyContent}/>
            {errors.studyContent && "内容の入力は必須です"}
          </FormControl>
          <FormControl>
            <FormLabel>学習時間</FormLabel>
            <Input type="number" {...register("studyTime", { required: true, min: { value: 0, message: "0以上で入力してください" } })} value={studyTime}  onChange={onChangeStudyTime} min={0} step={1}/>
            {errors.studyTime && "時間の入力は必須です"}
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" colorScheme='blue' mr={3} > 登録</Button>
        <Button onClick={onClose}>キャンセル</Button>
      </ModalFooter>
      </form>
    </ModalContent>
  </ModalOverlay>
</Modal>

    </>
  )
}

export default App;


