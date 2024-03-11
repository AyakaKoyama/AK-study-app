
//Class
export class Record {
    constructor
    ( 
        public id : string,
        public studyContent: string,
        public studyTime: number,
        public createDate : string
    ){}

//クラスごとに機能を持たせる(Dateを成形した状態で持っておく)
public static newRecord (
    id : string,
    studyContent: string,
    studyTime: number,
    createDate : string

):Record{
    return new Record(
        id,
        studyContent,
        studyTime,
        formatDate(createDate)
    )
}    
}

//日付成型
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    // getMonth() は0から始まるため、1を足す
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}/${month}/${day}`;
}