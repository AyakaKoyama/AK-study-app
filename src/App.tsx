import React, { useEffect, useState } from 'react'
import { addAllRecords, deleteRecords, getAllRecords, updateRecord } from './utils/supabaseFunctions';
import {Modal, ModalOverlay, ModalContent,  ModalHeader, ModalCloseButton, ModalBody, Stack, FormControl, FormLabel, Input, ModalFooter,
  Table,Thead,Tbody,Tr,Th,TableCaption,TableContainer,Td, Spinner,  useDisclosure, Button, Text, FormErrorMessage, } from '@chakra-ui/react'
import { Record } from './domain/record';
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  id:string,
  studyContent: string
  studyTime: number
  created_at:string
}

function App (){

  const { register, reset, formState: { errors }, handleSubmit, setValue } = useForm<IFormInputs>();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editRecords, setEditRecords] = useState<Record | null>(null);
  
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
  const onClickAdd = ()=> {
    setEditRecords(null);
    reset()
    onOpen()
    console.log(editRecords)
    }

  //編集ボタン
  const onClickEdit = (id: string)=>{
    const editRecord = records.find(record => record.id === id);
    if(editRecord) {
      setValue("studyContent", editRecord.studyContent); 
      setValue("studyTime", editRecord.studyTime); 
      setEditRecords(editRecord)
      // ここでID フィールドをセット
      setValue("id", editRecord.id); 
      setValue("created_at", editRecord.createDate); 
      onOpen();
    }else {
      console.error(`Record with ID ${id} not found.`);
    }
  } 


  const onSubmit: SubmitHandler<IFormInputs> = async data => {
    console.log(data)
    try {
      //records 配列をループして特定の id を持つレコードを見つける
      const existingRecord = records.find(record => record.id === data.id);
      console.log(existingRecord)
      //データ編集
      if(existingRecord){
          await updateRecord(data.id, data.studyContent, data.studyTime);
          const updatedRecords = records.map(record => (record.id === data.id ? { 
            ...record, studyContent: data.studyContent, studyTime: data.studyTime
            } : record));
          setRecords(updatedRecords);
      } else {
          // データ追加(supabase)
          const addedData = await addAllRecords(data.studyContent, data.studyTime);
          setRecords([...records, { 
            id: addedData.id, studyContent: data.studyContent, studyTime: data.studyTime, createDate: addedData.created_at 
          }]);
      }   
      // ここでリセット
      reset();
      onClose(); 
  } catch (error) {
      console.error('Failed to submit form data:', error);
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
      <Button 
        data-testid="new-submit" 
        onClick={onClickAdd}  
        colorScheme='teal'
        size='md'
        height='48px'
        width='200px'
        border='2px'
        borderColor='gray.500'>
        新規登録
      </Button>

<TableContainer>
  <Table data-testid="table" variant='striped' colorScheme='gray'>
    <TableCaption >学習記録</TableCaption>
    <Thead>
      <Tr>
        <Th data-testid="column1">学習内容</Th>
        <Th data-testid="column2">学習時間</Th>
        <Th>日付</Th>
      </Tr>
    </Thead>
    <Tbody >
    {records.map((record) => (      
      <Tr data-testid="tr" key={record.id}>
        <Td>{record.studyContent}</Td>
        <Td>{record.studyTime}</Td>
        <Td>{record.createDate}</Td>
        <Td>
          <Button 
          data-testid="delete" 
          onClick={() => onClickDelete(record.id) } 
          colorScheme='teal' 
          variant='outline'>削除
          </Button>
        </Td>
        <Td>
        <Button
          data-testid="edit"
          border='20px'
          borderColor='gray.500'
          colorScheme='teal'
          onClick={() => onClickEdit(record.id) }
        >
          編集
        </Button>
        </Td>
      </Tr>
            ))}
    </Tbody>

  </Table>
</TableContainer>

<Modal 
  data-testid="modal"
  isOpen = {isOpen} 
  onClose={onClose} 
  autoFocus={false} 
  motionPreset='slideInBottom'>
  <ModalOverlay>
    <ModalContent pb={6}>
      <ModalHeader data-testid="modal-title"> 
        {editRecords ? "記録編集" : "新規登録"}
      </ModalHeader>
      <ModalCloseButton/>
      <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody mx={4}>
        <Stack spacing ={4}>
          <FormControl isInvalid={!!errors.studyContent}>
            <FormLabel>学習内容</FormLabel>
            <Input data-testid="study-content-input" {...register("studyContent", { required: true })}/>
            <FormErrorMessage>
              {errors.studyContent && "内容の入力は必須です"}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.studyTime}>
            <FormLabel>学習時間</FormLabel>
            <Input data-testid="study-time-input" type="number" {...register("studyTime", { required: true,valueAsNumber: true, min: {  value: 1, message: "0以上で入力してください" } })} min={0} step={1}/>
            <FormErrorMessage>
            {errors.studyTime && "0以上で入力してください" }
            </FormErrorMessage>
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button data-testid="submit" type="submit" colorScheme='teal' mr={3} > 登録</Button>
        <Button 
          onClick={() => {
          onClose();
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


