import { FC, memo } from "react";
import {Modal, ModalOverlay, ModalContent,  ModalHeader, ModalCloseButton, ModalBody, Stack, FormControl, FormLabel, Input, ModalFooter, Button} from '@chakra-ui/react'
import React from "react";

type Props ={
  isOpen: boolean;
  onClose:()=>void;
  onAddRecord:()=>void;
  onChangeStudyContent: (event: React.ChangeEvent<HTMLInputElement>) => void;
  studyContent:string
  onChangeStudyTime: (event: React.ChangeEvent<HTMLInputElement>) => void;
  studyTime:number
}

// eslint-disable-next-line react/display-name
export const ModalDetail : FC<Props> =memo ((props)=>{
  // eslint-disable-next-line react/prop-types
  const{ isOpen, onClose, onAddRecord, onChangeStudyContent, studyContent, onChangeStudyTime, studyTime}=props;


return(
<Modal isOpen = {isOpen} onClose = {onClose} autoFocus={false} motionPreset='slideInBottom'>
  <ModalOverlay>
    <ModalContent pb={6}>
      <ModalHeader>学習記録</ModalHeader>
      <ModalCloseButton/>
      <ModalBody mx={4}>
        <Stack spacing ={4}>
          <FormControl>
            <FormLabel>学習内容</FormLabel>
            <Input value={studyContent}  onChange={onChangeStudyContent}/>
          </FormControl>
          <FormControl>
            <FormLabel>学習時間</FormLabel>
            <Input type="number" value={studyTime}  onChange={onChangeStudyTime} min={0} step={1}/>
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onAddRecord}> 登録</Button>
        <Button onClick={onClose}>キャンセル</Button>
      </ModalFooter>
    </ModalContent>
  </ModalOverlay>
</Modal>
)
})
