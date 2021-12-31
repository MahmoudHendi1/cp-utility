const axios = require('axios');
const e = require('express');


module.exports = async function validator(handles,type){
   
    const gymsMap = new Map();
    const gyms =[];
    const err=[];

    await axios.get(`https://codeforces.com/api/contest.list?${type!=='gym'?'':'gym=true'}`)
    .then(async response => {
        if(response.data.status !=='OK'){
            err.push(response.data.comment);
        }else{
            await response.data.result.forEach( gym => {
                gymsMap.set(gym.id,gym);
            }); 
            for(var i = 0 ; i < handles.length;i++){
                await axios.get('https://codeforces.com/api/user.status?handle='+handles[i])
                .then(response => {
                    if(response.data.status !=='OK'){
                        err.push(response.data.comment);
                    }else{
                        response.data.result.forEach(subb => {
                            gymsMap.delete(subb.contestId);
                        });
                    }
                })
                .catch(error => {
                    err.push('Bad user');
                });
            }
        }
    })
    .catch(error => {
        err.push('Bad user');
    });
    gymsMap.forEach((value) => {
        gyms.push(value);
    });
    if(type!=='gym')gyms.reverse();
    return {gyms,err};       

}
