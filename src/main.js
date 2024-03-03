import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-f78df-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingInDB = ref(database, "shoppingList")

const addItemBtn = document.getElementById("add-item-btn")
const itemInputEl = document.getElementById("item-input")
const shoppingListEl = document.getElementById("shopping-list")

onValue(shoppingInDB, function(snapshot) {
    if(snapshot.exists()) {
        let itemsArray = Object.entries((snapshot.val()))
        clearShoppingList()
        for (let i = 0; i < itemsArray.length; i++) {
            appendToList(itemsArray[i])
        }
    } else {
        shoppingListEl.innerHTML = "<li>No shopping list items</li>"
    }
})

function appendToList(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let li = document.createElement("li")
    let span = document.createElement("span")
    span.setAttribute("role", "button")
    span.setAttribute("tabindex", "0")
    span.setAttribute("aria-label", `Delete ${itemValue} item`)
    span.addEventListener("dblclick", function() {
        let locationInDB = ref(database, `shoppingList/${itemID}`)
        remove(locationInDB)
    })
    span.textContent = itemValue
    li.append(span)
    shoppingListEl.append(li)
}

addItemBtn.addEventListener("click", function() {
    push(shoppingInDB, itemInputEl.value)
    clearInputField()
})

function clearInputField() {
    itemInputEl.value = ""
}

function clearShoppingList() {
    shoppingListEl.innerHTML = ""
}