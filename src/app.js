const path = require('path');
const express = require('express');
const validator = require('./utils/validator');


const hbs = require('hbs');
const fs = require('fs');




const app =express()
const port=process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')

app.set('view engine','hbs')
app.set('views',viewsPath)

app.use(express.static(publicDirectoryPath))


app.get('',(req, res)=>{
    res.render('index',{
        title:'GDSC- FCAI',
    })
})
 
app.get('/contests',async (req, res)=>{
    if(!req.query.handles || !req.query.type)return res.status(404).send('you have to enter at least one handle');

    const data = await validator(req.query.handles.split(','),req.query.type);
    
    if(data.err.length>0){
        res.err=data.err;
        return res.status(404).send(data);
    }

    
    res.status(200).send({
        'contests':data.contests,
        'err':data.err});
    return;
})

app.get('*',(req, res)=>{
    res.render('404',{
        title:'404',
        errorMessage : 'Page not found!'
    })
})

app.listen(port,()=>{
    console.log('server is up ' + port)
})