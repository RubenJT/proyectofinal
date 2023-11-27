const {request,response} = require('express');
const pool = require('../db');
const usersModel = require('../models/users');
const Listusers= async(req = request,res=response)=>{
    let conn;
    try {conn = await pool.getConnection();
        
        const  users = await conn.query(usersModel.getAll,(err)=>{
            if(err){
                throw new Error(err); }})

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }}

const findid= async(req = request,res=response)=>{
    const{id}=req.params;

    if(isNaN(id)){
        res.status(400).json({msg:'Invalid ID'});
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        
        const [user] = await conn.query(usersModel.getByID,[id],(err)=>{  
            if(err){
                throw new Error(err);    
            }})

        if(!user){
            res.status(404).json({msg:'title not found'});
            return;
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);  
    }finally{
        if(conn) conn.end();
    }
}
const adduser = async (req = request,res = response) =>{
    const {
        duration_minutes,
        type,
        title,
        show_id
    } = req.body;
    if (!duration_minutes|| !type|| !title|| !show_id){
        res.status(400).json({msg: 'Missing information'});
        return;
    }




    const user = [
        duration_minutes,
        type,
        title,
        show_id
    ];

    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameUser] = await conn.query(
            usersModel.gettitle,
            [title],
            (err) => {if (err) throw err;}
        );
        if(usernameUser) {
            res.status(409).json({msg:`Movie or serie  with title ${title} alredy exist`});
            return;
        }

        
        const userAdded = await conn.query(
            usersModel.addRow, 
            [...user], 
            (err) => {if (err) throw err;}
        );
        
        if (userAdded.affectedRows === 0) throw new Error({msg: 'Failed to add title'});

        res.json({msg: 'title added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

const change=async(req, res)=>{
    const {
        duration_minutes,
        type,
        title,
        show_id
    } = req.body;

const {id} = req.params;


let newUserData=[
    duration_minutes,
    type,
    title,
    show_id
];
let conn;
try{
    conn = await pool.getConnection();
const [userExists]=await conn.query(
    usersModel.getByID,
    [id],
    (err) => {if (err) throw err;}
);
if (!userExists || userExists.id_active === 0){
    res.status(404).json({msg:'title not found'});
    return;
}

const [usernameUser] = await conn.query(
    usersModel.gettitle,
    [title],
    (err) => {if (err) throw err;}
);
if (usernameUser){
    res.status(409).json({msg:` title ${title} already exists`});
    return;
}


const oldUserData = [
    userExists.duration_minutes,
    userExists.type,
    userExists.title,
    userExists.show_id
];

newUserData.forEach((userData, index)=> {
    if (!userData){
        newUserData[index] = oldUserData[index];
    }
})

const userUpdate = await conn.query(
    usersModel.getupdate,
    [...newUserData, id],
    (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
    throw new Error ('title not updated');
}
res.json({msg:'title updated successfully'})
}catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}



const deletes = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const {id} = req.params;

        const [userExists] = await conn.query(
            usersModel.getByID,
            [id],
            (err) => {if (err) throw err;}
        );

        if (!userExists|| userExists.is_active === 0){
            res.status(404).json({msg:'title not found'});
            return;
        }

        const userDelete = await conn.query(
            usersModel.deleteRow,
            [id],
            (err) => {if (err) throw err;}
        );

        if (userDelete.affectedRows === 0) 
            throw new Error ({msg: 'Failed to delete title'});

        res.json({msg: 'title deleted succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error); 
    }finally{
        if (conn) conn.end();
    }
}




module.exports={
    Listusers,findid,adduser,change,deletes
};