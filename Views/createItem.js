
const itemForm = document.getElementById('itemForm');

itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemData = new FormData(itemForm);

   const response = await fetch('http://localhost:5000/Createitem', {
            method: 'POST',
            body: itemData
        });

        if (response.status == 200) {
            window.alert('Item created')
        } else {
            message.innerHTML = 'Something went wrong'
        }
});

const bruger = localStorage.getItem('email')
const visVare = document.getElementById('visVare');
const itemList = document.getElementById('itemList');

visVare.addEventListener('click', async () => {
    itemList.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Kategori</th>
        <th>Pris</th>
        <th>Vare</th>
        <th>billede</th>
    <tr/> 
    `; 

    await fetch('http://localhost:5000/Createitems', {
        method: 'GET'
    })
    .then((res) => res.json())
    .then((res) => {
        res.forEach((e) => {
            if(e.email === bruger) {
                itemList.innerHTML +=`
                <tr>
                    <td>${e.uniq}</td>
                    <td>${e.kategori}</td>
                    <td>${e.pris}</td>
                    <td>${e.vare}</td>
                    <td><img src="${e.itemPic}" /></td>
                </tr>
                `;
            }
        });
    })

});