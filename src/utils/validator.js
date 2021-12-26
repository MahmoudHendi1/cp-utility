const axios = require('axios');
const e = require('express');


module.exports = async function validator(handles){
   
    const contestIDs = new Set();
    const err=[];

    await axios.get('https://codeforces.com/api/contest.list?gym=true')
    .then(async response => {
        if(response.data.status !=='OK'){
            err.push(response.data.comment);
        }else{
            await response.data.result.forEach( gym => {
                contestIDs.add(gym.id);
            }); 
            for(var i = 0 ; i < handles.length;i++){
                await axios.get('https://codeforces.com/api/user.status?handle='+handles[i])
                .then(response => {
                    if(response.data.status !=='OK'){
                        err.push(response.data.comment);
                    }else{
                        response.data.result.forEach(subb => {
                            contestIDs.delete(subb.contestId);
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

    return {contestIDs,err};       

}
