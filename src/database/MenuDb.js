import pool from '../database/conect.js'


export const GetMenuDb = async()=>{
    try{

        const sqlQuery = 'SELECT name FROM name_menu ;';
        const data = await pool.query(sqlQuery)
        return [true,data.rows]
    }catch(err){
        return [false, err]
    }

}

export const AddMenuDb = async(name)=>{
    try{
        const findByName = await pool.query("select name from name_menu where name = ($1) ;",[name])
        if(findByName.rows.length==0){
            await pool.query("INSERT INTO name_menu (name) VALUES ($1)",[name])
            const nameMenus = await pool.query("select name from name_menu ;")
            return [true, nameMenus.rows]
        }else{
            return [false,"Tên dã tồn tại!"]
        }
    }catch(err){
        return [false, err]
    }

}


export const DeleteMenuDb = async(name)=>{
    try{
        const findByName = await pool.query("select name from name_menu where name = ($1) ;",[name])
        if(findByName.rows.length==0){
            return [false, "Không tìm thấy tên cần xóa!"]
        }else{
            await pool.query("DELETE FROM name_menu WHERE name = ($1);", [name])
            const nameMenus = await pool.query("select name from name_menu ;")
            return [true, nameMenus.rows]
        }
        
    }catch(err){
        return [false, err]
    }
}
