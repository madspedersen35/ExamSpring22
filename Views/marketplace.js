const filterBtn = document.getElementById('filterBtn');
const followBtn = document.getElementById('followBtn');
const itemList = document.getElementById('itemList');

document.addEventListener('DOMContentLoaded', async () => {
    getProducts();
})

followBtn.addEventListener('click', async () => {
    const followItemId = document.getElementById('followItemId').value;

    const follow = {
        userId: JSON.parse(localStorage.getItem('user')).id,
        itemId: followItemId
    }

    const response = await fetch('http://localhost:5000/followItem/', {
        method: "POST",
        body: JSON.stringify(follow),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.status == 200) {
        alert("followed itemid " + followItemId)
    } else {
        alert('follow failed')
    }
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

                let postnrFilter = document.getElementById('postnr').value;
                if (postnrFilter) {
                    if (item.zip != postnrFilter) {
                        passedFilter = false;
                    }
                }

                let origPriceFilter = document.getElementById('origPrice').value;
                if (origPriceFilter) {
                    if (item.originalPrice != origPriceFilter) {
                        passedFilter = false;
                    }
                }

                let priceFilter = document.getElementById('price').value;
                if (priceFilter) {
                    if (item.price != priceFilter) {
                        passedFilter = false;
                    }
                }

                let oppetidFilter = document.getElementById('oppetid').value;
                if (oppetidFilter) {
                    let compareDate = new Date();
                    compareDate.setDate(compareDate.getDate() - oppetidFilter);
                    if (new Date(item.createdAt) <= compareDate) {
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