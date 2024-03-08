import { supabase } from "../utils/supabase" 

export const getAllRecords = async()=>{
    const records = await supabase.from("study-record").select("*")
    return records.data;
}