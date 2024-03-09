
//Class
export class Record {
    constructor
    ( 
        public id : string,
        public contents: string,
        public time: boolean,
        public created_at : string
    ){}

//クラスごとに機能を持たせる(Dateを成形した状態で持っておく)
public static newRecord (
    id : string,
    contents: string,
    time: boolean,
    created_at : string

):Record{
    return new Record(
        id,
        contents,
        time,
        formatDate(created_at)
    )
}    
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    // getMonth() は0から始まるため、1を足す
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}/${month}/${day}`;
}