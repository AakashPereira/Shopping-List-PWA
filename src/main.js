import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://new-shopping-list-5854f-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "shopping-list")

const inputEl = document.getElementById("item-input")
const nameEl = document.getElementById("name-input")
const shopEl = document.getElementById("shop-input")
const addBtn = document.getElementById("add-btn")

const itemsContainer = document.getElementById("items-container")

addBtn.addEventListener("click", function() {
    const item = {
        item: inputEl.value,
        name: nameEl.value,
        shop: shopEl.value
    }
    push(referenceInDB, item)
    inputEl.value = ""
    inputEl.focus()
})

onValue(referenceInDB, function(snapshot) {
    itemsContainer.textContent = ""
    if(snapshot.exists()) {
        let records = snapshot.val()
        records = Object.entries(records)
        for (let x = 0; x < records.length; x++) {
            const liEl = document.createElement("li")
            liEl.classList.add("item")
            liEl.textContent = records[x][1].item
            const infoEl = document.createElement("div")
            infoEl.classList.add("info")
            const nameEl = document.createElement("div")
            nameEl.textContent = records[x][1].name
            nameEl.classList.add("name", records[x][1].name)
            const shopEl = document.createElement("div")
            shopEl.textContent = records[x][1].shop
            shopEl.classList.add("shop", (records[x][1].shop).replaceAll(' ', ''))
            infoEl.append(nameEl)
            infoEl.append(shopEl)
            liEl.insertAdjacentElement("afterbegin", infoEl)
            liEl.addEventListener("click", function() {
                deleteItem(records[x][0], records[x][1].item)
            })
            itemsContainer.append(liEl)
        }
    } else {
        console.log("Empty")
    }
})

function deleteItem(itemRef, itemName) {
    if (confirm(`Are you sure you want to remove ${itemName}?`)) {
        remove(ref(database, `shopping-list/${itemRef}`))
    }
}