import pool from "./conect.js";

export const GetNotesDb = async(nameMenu)=>{
    try{
        const data = await pool.query('SELECT name_menu, title, contents, tag FROM note where name_menu = ($1) ;', [nameMenu])
        const dataMap = data.rows.map((item)=>({
            nameMenu : item.name_menu,
            title : item.title,
            contents : item.contents,
            tag : item.tag,
        }))
        

        return [true,dataMap]
    }catch(err){
        return [false, err]
    }
}


export const AddNoteDb = async(noteItem)=>{
    try{
        const findNoteItemByTitle = await pool.query('select title from note where name_menu = ($1) and title = ($2)', [noteItem.nameMenu, noteItem.title])
      
        if(findNoteItemByTitle.rows.length>0){
            return [false, "Tiêu đề đã tồn tại!"]
        }

        await pool.query("INSERT INTO note (title, name_menu, contents, tag) VALUES (($1), ($2), ($3), ($4))", 
            [noteItem.title, noteItem.nameMenu, noteItem.contents, noteItem.tag])

        const data = await GetNotesDb(noteItem.nameMenu)
      
        return data
    }catch(err){
        return [false, err]
    }
}


export const DeleteNoteDb = async(nameMenu, title)=>{
    try{
        const findNoteItemByTitle = await pool.query('select title from note where name_menu = ($1) and title = ($2)', [nameMenu, title])
        if(findNoteItemByTitle.rows.length>0){
            await pool.query("DELETE FROM note WHERE name_menu = ($1) and title = ($2);", [nameMenu, title])
            const data = await GetNotesDb(nameMenu)
            return data
        }else{
            return [false, "Không tìm thấy note cần xóa!"]
        }
    }catch(err){
        return [false, err]
    }   




}

