import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const itemInputEl = document.getElementById("item-input")
const userInputEl = document.getElementById("user-input")
const addItemBtn = document.getElementById("add-item-btn")

const shoppingItemsContainer = document.getElementById("shopping-items-container")

const errorEl = document.getElementById("error-el")

const banSugarBtn = document.getElementById("ban-sugar-btn")
const banSugarEl = document.getElementById("ban-sugar-el")

const firebaseConfig = {
    databaseURL: "https://shopping-list-5aef4-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const refInDB = ref(database, "shoppingList")

addItemBtn.addEventListener("click", function() {
    const item = itemInputEl.value
    const user = userInputEl.value
    if (validateItem(item, user)) {
        addItem(item, user)
    }
})

function validateItem(itemValue, userInput) {
    if (itemValue.length === 0) {
        errorEl.innerHTML = `<img src="src/img/error.png" alt="Error"> Enter a valid item`
        errorEl.classList.add("error-el-display")
        return false
    } else {
        errorEl.textContent = ""
        errorEl.classList.remove("error-el-display")
        return true
    }
}

function addItem(newItem, shopper) {
    const itemArr = [newItem, shopper]
    push(refInDB, itemArr)
    clearInput()
    focusInput()
}

function clearInput() {
    itemInputEl.value = ""
}

function focusInput() {
    itemInputEl.focus()
}

onValue(refInDB, function(snapshot) {
    shoppingItemsContainer.innerHTML = ""
    if (snapshot.exists()) {
        const shoppingItems = Object.entries(snapshot.val())
        let shoppingItemsDom = ""
        for (let x = 0; x < shoppingItems.length; x++) {
            let liEl = document.createElement("li")
            liEl.textContent = shoppingItems[x][1][0]
            liEl.classList.add("item")
            liEl.addEventListener("click", function() {
                removeItem(shoppingItems[x][0], shoppingItems[x][1][0])
            })
            liEl.setAttribute("role", "button")
            liEl.setAttribute("tabindex", "0")
            liEl.setAttribute("aria-label", `Remove ${shoppingItems[x][1][0]}, by ${shoppingItems[x][1][1]}`)
            let shopperEl = document.createElement("div")
            shopperEl.textContent = shoppingItems[x][1][1]
            shopperEl.classList.add("shopperName")
            shopperEl.classList.add(`${shoppingItems[x][1][1].toLowerCase()}`)
            liEl.appendChild(shopperEl)
            shoppingItemsContainer.insertAdjacentElement("beforeend", liEl)
        }
    }
})

function removeItem(itemID, itemName) {
    if (window.confirm(`Are you sure you want to delete ${itemName}?`)) {
        remove(ref(database, `shoppingList/${itemID}`))
    }
}

banSugarBtn.addEventListener("click", function() {
    setSugarKey()
})

function setSugarKey() {
    localStorage.setItem("banSugar", "true")
}

if (localStorage.getItem("banSugar") === "true") {
    banSugarEl.innerHTML = `<img src="src/img/warning.png" alt="Error"> REMEMBER! SUGAR BAN IS ACTIVE`
    banSugarEl.classList.add("error-el-display")
}