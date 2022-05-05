
const submitVare = document.getElementById('submitVare');

submitVare.addEventListener('click', async (e) => {
    var category = document.getElementById('kategori').value
    var originalpris = document.getElementById('originalpris').value
    var pris = document.getElementById('pris').value
    var vare = document.getElementById('vare').value
    var picture = document.getElementById('picture').value
    var zip = document.getElementById('zip').value

    const item = {
        category: category,
        originalPrice: originalpris,
        price: pris,
        header: vare,
        picture: picture,
        zip: zip,
        person: JSON.parse(localStorage.getItem('user')).id
    }

    const response = await fetch('http://localhost:5000/Createitem', {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        alert("created");
    } else {
        alert('created failed');
    }
});

const visVare = document.getElementById('visVare');
const itemList = document.getElementById('itemList');

visVare.addEventListener('click', async () => {
    itemList.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Kategori</th>
        <th>Titel</th>
        <th>Orig. Pris</th>
        <th>Pris</th>
        <th>billede</th>
        <th></th>
    <tr/> 
    `;

    await fetch('http://localhost:5000/items/' + JSON.parse(localStorage.getItem('user')).id, {
        method: 'GET'
    })
        .then((res) => res.json())
        .then((res) => {
            for (let item of res) {
                let category = "";
                switch (item.category) {
                    case 1:
                        category = "Fiskeudstyr";
                        break;
                    case 2:
                        category = "Planter";
                        break;
                    case 3:
                        category = "Legetøj";
                        break;
                    case 4:
                        category = "Udendørs";
                        break;
                    case 5:
                        category = "Biler";
                        break;
                }
                itemList.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${category}</td>
                    <td>${item.header}</td>
                    <td>${item.originalPrice}</td>
                    <td>${item.price}</td>
                    <td><img src="${item.picture}" height="50px" width="50px" /></td>
                </tr>
                `;
            }
        });
})