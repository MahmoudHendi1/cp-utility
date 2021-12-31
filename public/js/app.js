const form = document.querySelector('#form');
const table = document.querySelector('#GYM_table');

function secondsToHms(s) {
    s = Number(s);
    var d = Math.floor(s / 86400);
    var h = Math.floor(s % 86400 / 3600);
    var m = Math.floor(s % 86400 % 3600 /60);

    var dDisplay = d > 0 ? d : "";
    var hDisplay = h > 9 ? h : "0" + h;
    var mDisplay = m > 9 ? m : "0" + m;
    return `${dDisplay?dDisplay+":":""} ${hDisplay}:${mDisplay}`; 
}


form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    if(table.querySelector('tbody'))table.querySelector('tbody').remove();
    form.elements['button'].disabled = true;


    const handles= form.elements['handles'].value;
    const type=form.elements['type'].options[form.elements['type'].selectedIndex].value;
    
    const url=`/gyms?handles=${handles}&type=${type}`;
    const data = await fetch(url);

    if(data.status===404){
        form.elements['button'].disabled = false;
        return alert('Users not found, make sure to follow the correct format');
    }
  
    form.elements['button'].disabled = false;


    var tbody = table.createTBody();
    
    (await data.json()).gyms.reverse().forEach(gym => {
        var row = tbody.insertRow();

        var gymName = row.insertCell(0);
        gymName.setAttribute('class','center aligned')
        var lnk = document.createElement('a');
        lnk.setAttribute("href", `https://codeforces.com/gym/${gym.id}`);
        lnk.innerHTML = gym.name;
        gymName.append(lnk);
        
        var gymDuration = row.insertCell(1);
        gymDuration.setAttribute('class','center aligned')
        gymDuration.innerHTML = secondsToHms(gym.durationSeconds);
        
        var gymType = row.insertCell(2);
        gymType.setAttribute('class','center aligned')
        gymType.innerHTML = gym.type;

        var gymDifficulty =  row.insertCell(3);
        var stars = document.createElement('div');
        stars.setAttribute('class','Stars center aligned');
        stars.setAttribute('style',`--rating: ${gym.difficulty}`);
        gymDifficulty.append(stars);

        
    });
    
})