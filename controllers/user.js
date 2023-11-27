const {request,response} = require('express');
const pool = require('../db');
const usersModel = require('../models/users');


const listusers= async(req = request,res=response)=>{
    let conn;
    try {
        conn = await pool.getConnection();
        
        const  users = await conn.query(usersModels.getAll,(err)=>{
            if(err){
                throw new Error(err);   
            }
        })

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

const listUserByID= async(req = request,res=response)=>{
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
            }
        })

        if(!user){
            res.status(404).json({msg:'User not found'});
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
            usersModel.getByUsername,
            [title],
            (err) => {if (err) throw err;}
        );
        if(usernameUser) {
            res.status(409).json({msg:`User with username ${title} alredy exist`});
            return;
        }

        
        const userAdded = await conn.query(
            usersModel.addRow, 
            [...user], 
            (err) => {if (err) throw err;}
        );
        
        if (userAdded.affectedRows === 0) throw new Error({msg: 'Failed to add user'});

        res.json({msg: 'User added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}
//actu data
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
    res.status(404).json({msg:'User not found'});
    return;
}

const [usernameUser] = await conn.query(
    usersModel.getByUsername,
    [title],
    (err) => {if (err) throw err;}
);
if (usernameUser){
    res.status(409).json({msg:`User with username ${name} already exists`});
    return;
}


const oldUserData = [
    userExist.duration_minutes,
    userExist.type,
    userExist.title,
    userExist.show_id
];

newUserData.forEach((userData, index)=> {
    if (!userData){
        newUserData[index] = oldUserData[index];
    }
})

const userUpdate = await conn.query(
    usersModel.updateRow,
    [...newUserData, id],
    (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
    throw new Error ('User not updated');
}
res.json({msg:'User updated successfully'})
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
            res.status(404).json({msg:'User not found'});
            return;
        }

        const userDelete = await conn.query(
            usersModel.deleteRow,
            [id],
            (err) => {if (err) throw err;}
        );

        if (userDelete.affectedRows === 0) 
            throw new Error ({msg: 'Failed to delete user'});

        res.json({msg: 'User deleted succesfully'});
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