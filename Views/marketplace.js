const filterBtn = document.getElementById('filterBtn');
const itemList = document.getElementById('itemList');

document.addEventListener('DOMContentLoaded', async () => {
    getProducts();
})

filterBtn.addEventListener('click', async () => {
    getProducts();
})

async function getProducts() {
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

    await fetch('http://localhost:5000/items/', {
        method: 'GET'
    })
        .then((res) => res.json())
        .then((res) => {
            for (let item of res) {
                //Filter
                let passedFilter = true;

                let categoryFilter = document.getElementById('kategori').value;
                if (categoryFilter) {
                    if (item.category != categoryFilter) {
                        passedFilter = false;
                    }
                }

                if (passedFilter) {
                    //Translate category ID to Category name
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
            }
        });
}