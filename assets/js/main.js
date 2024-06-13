import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
   databaseURL: "https://upskilling-8ad93-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDB = ref(database, "shoppingList")

const addItemBtn = document.getElementById("add-item-btn")
const itemInput = document.getElementById("item-input")

const itemsContainer = document.getElementById("items-container")

addItemBtn.addEventListener("click", function() {
    addItemToList(itemInput.value)
})

function addItemToList(value) {
    if(value.length > 0) {
        push(itemsInDB, value)
        handleAfterEntry()
    } else {
        alert("Enter a shopping item to add to the list")
    }
}

function handleAfterEntry() {
    itemInput.value = ""
    itemInput.focus()
}

onValue(itemsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    clearContainer()

    for (let i = 0; i < itemsArray.length; i++) {
        let itemID = itemsArray[i][0]
        let itemValue = itemsArray[i][1]
        
        let liEl = document.createElement("li")
        liEl.classList.add("item")

        let buttonEl = document.createElement("button")
        buttonEl.textContent = itemValue
        buttonEl.setAttribute("aria-label", `Remove ${itemValue}`)

        liEl.insertAdjacentElement("beforeend", buttonEl)

        liEl.addEventListener("click", function() {
            if (confirm("Are you sure you've bought this item?")) {
                let exactItemLocation = ref(database, `shoppingList/${itemID}`)
                remove(exactItemLocation)
            }
        })
        itemsContainer.insertAdjacentElement("beforeend", liEl)
    }
    } else {
        itemsContainer.innerHTML = "<li>There are no items to buy right now...</li>"
    }
})

function clearContainer() {
    itemsContainer.innerHTML = ""
}