import { Record } from "../domain/record"
import { supabase } from "../utils/supabase" 

export const getAllRecords = async()=>{
    const records = await supabase.from("study-record").select("*")
    console.log(records)
    //ClassにSupabaseから取得した値を渡してあげる
    if (records.data !== null){const recordsData = records.data.map((record)=>{
        return Record.newRecord(record.id, record.studyContent, record.studyTime, record.created_at)
    })
return recordsData

    }else{
        return [];
    }
}

export async function addAllRecords(studyContent: string, studyTime: number) {
    const response = await supabase
        .from('study-record')
        .insert([
            { studyContent, studyTime },
        ])
        .select()
    if (response.data !== null) {
        return (response.data[0])
    }

}
