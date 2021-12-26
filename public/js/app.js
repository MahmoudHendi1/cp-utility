const form = document.querySelector('#form');


form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    if(document.querySelector('#GYM_tabel'))document.querySelector('#GYM_tabel').remove();
    form.elements['button'].disabled = true;



    const handels= form.elements['handels'].value;
    const type=form.elements['type'].options[form.elements['type'].selectedIndex].value;
    
    const url=`/gyms?handels=${handels}&type=${type}`;
    const data = await fetch(url);

    if(data.status===404){
        form.elements['button'].disabled = false;
        return alert('Users not found, make sure to follow the correct format');
    }
  
    form.elements['button'].disabled = false;


    // Adding the entire table to the body tag
    let table = document.createElement('table');
    table.setAttribute("id","GYM_tabel");
    table.className="ui celled table";
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);


    let header = document.createElement('tr');
    let heading_1 = document.createElement('th');
    heading_1.innerHTML = "Gym Url";
    header.appendChild(heading_1);
    thead.appendChild(header);
    
    (await data.json()).ids.reverse().forEach(id => {
        let row = document.createElement('tr');
        let row_data = document.createElement('td');
        let lnk = document.createElement('a');

        lnk.setAttribute("href", `https://codeforces.com/gym/${id}`);
        lnk.innerHTML = `https://codeforces.com/gym/${id}`;
        row_data.append(lnk);
        row.appendChild(row_data);
        tbody.appendChild(row);
    });
    document.getElementById('main').appendChild(table);


    
})