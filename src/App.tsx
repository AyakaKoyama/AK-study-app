import React, { useEffect, useState } from 'react'
import { addAllRecords, deleteRecords, getAllRecords } from './utils/supabaseFunctions';
import {Modal, ModalOverlay, ModalContent,  ModalHeader, ModalCloseButton, ModalBody, Stack, FormControl, FormLabel, Input, ModalFooter,
  Table,Thead,Tbody,Tr,Th,TableCaption,TableContainer,Td, Spinner,  useDisclosure, Button, Text, } from '@chakra-ui/react'
import { Record } from './domain/record';
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  studyContent: string
  studyTime: number
}

function App (){

  const { register, reset, formState: { errors }, handleSubmit } = useForm<IFormInputs>();
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
        //console.log(record);
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

  const onSubmit: SubmitHandler<IFormInputs> = async data => {
    console.log(data); 
    try {
     //データ追加(supabase)
    const addedData = await addAllRecords(data.studyContent, data.studyTime);
    const newRecord = { id: addedData.id, studyContent: data.studyContent, studyTime: data.studyTime, createDate: addedData.created_at };
    setRecords([...records, newRecord]);
    //ここでリセット
    reset({ studyContent: '' })
    reset({ studyTime: 0 })
    //モーダルを閉じる
    onClose(); 
    } catch (error) {
      console.error('Failed to submit form data:', error);
    }
  };
  console.log(studyTime, studyContent)

  

  const onChangeStudyContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputContent = event.target.value;
    setStudyContent(inputContent);
  };
  const onChangeStudyTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) { // 入力値が数値であることを確認
      const time = parseInt(inputValue); // 数値に変換
      setStudyTime(time);
  }
  };

  const onClickDelete= async (id: string) => {
    try {
      await deleteRecords(id);
      const newRecords = records.filter((r) => r.id !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  
  
  return (
    <>
      <Text data-testid="title" fontSize='3xl' >学習記録アプリ</Text>
      {loading && <Spinner data-testid="loading" thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />} 
      <Button data-testid="new-submit" onClick={onClickAdd}  colorScheme='teal'>新規登録</Button>
<TableContainer>
  <Table data-testid="table" variant='simple'>
    <TableCaption >学習記録</TableCaption>
    <Thead>
      <Tr>
        <Th data-testid="column1">学習内容</Th>
        <Th data-testid="column2">学習時間</Th>
        <Th>日付</Th>
      </Tr>
    </Thead>
    <Tbody>
    {records.map((record) => (
      <>
      <Tr key={record.id}>
        <Td>{record.studyContent}</Td>
        <Td>{record.studyTime}</Td>
        <Td>{record.createDate}</Td>
      </Tr>
      <Button onClick={() => onClickDelete(record.id) } colorScheme='teal' variant='outline'>削除</Button>
      </>
            ))}
    </Tbody>

  </Table>
</TableContainer>

<Modal 
  isOpen = {isOpen} 
  onClose={onClose} 
  autoFocus={false} 
  motionPreset='slideInBottom'>
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
            <Input type="number" {...register("studyTime", { required: true,valueAsNumber: true, min: {  value: 1, message: "0以上で入力してください" } })} value={studyTime}  onChange={onChangeStudyTime} min={0} step={1}/>
            {errors.studyTime && "0以上で入力してください" }
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" colorScheme='blue' mr={3} > 登録</Button>
        <Button 
          onClick={() => {
          onClose();
          reset();
        }}>キャンセル</Button>
      </ModalFooter>
      </form>
    </ModalContent>
  </ModalOverlay>
</Modal>

    </>
  )
}

export default App;


