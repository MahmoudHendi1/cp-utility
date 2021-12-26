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
 
app.get('/gyms',async (req, res)=>{
    if(!req.query.handels)return res.status(404).send('you have to enter at least one handel');

    const gyms = await validator(req.query.handels.split(','));
    
    if(gyms.err.length>0){
        res.err=gyms.err;
        return res.status(404).send(gyms);
    }


    res.status(200).send({
        'ids':array= [...gyms.contestIDs],
        'err':gyms.err});
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