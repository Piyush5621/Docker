const express =require('express')
const app=express()

const PORT=8000

app.get('/',(req,res)=>{
    return res.json({message: "Hey , iam node js in container"})
})

app.listen(PORT,()=>{
    console.log("App is Running in 8000")
})