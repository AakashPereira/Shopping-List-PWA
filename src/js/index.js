import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://upskilling-8ad93-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "shoppingList")

const itemInput = document.getElementById("item-input")
const ownerCombo = document.getElementById("owner-combo")
const addBtn = document.getElementById("add-btn")
const addForm = document.getElementById("add-form")

const shoppingListEl = document.getElementById("shopping-list")
const statusMsgEl = document.getElementById("status-msg")

addForm.addEventListener("submit", function(e) {
    e.preventDefault()
    if(validateData(ownerCombo.value, itemInput.value)) {
        statusMsgEl.innerText = ""
        statusMsgEl.classList.add("hidden")
        const record = {
            buyer: ownerCombo.value,
            item: itemInput.value
        }
        push(referenceInDB, record)
        handleAfterEntry()
    } else {
        statusMsgEl.innerText = "Fill in all the fields"
        statusMsgEl.classList.remove("hidden")
    }
})

function validateData(buyer, item) {
    if (buyer === "" || item.length === 0) {
        return false
    } else {
        return true
    }
}

function handleAfterEntry() {
    itemInput.value = ""
    itemInput.focus()
}

onValue(referenceInDB, function(snapshot) {
    if (snapshot.exists()) {

        clearShoppingList()

        const shoppingItemsInDB = Object.entries(snapshot.val())
        shoppingItemsInDB.forEach(function(item) {

            const itemId = item[0]
            const itemOwner = item[1].buyer
            const itemName = item[1].item

            const buttonEl = document.createElement("button")
            buttonEl.innerText = itemName
            buttonEl.setAttribute("aria-label", `Remove ${itemName}`)

            const spanEl = document.createElement("span")
            spanEl.innerText = itemOwner
            spanEl.classList.add("buyer")

            switch(itemOwner) {
                case "Aakash":
                    spanEl.classList.add("buyer-aakash")
                    break;
                case "Adrian":
                    spanEl.classList.add("buyer-adrian")
                    break;
                case "Eraisha":
                    spanEl.classList.add("buyer-eraisha")
                    break;
                case "Pruthuvi":
                    spanEl.classList.add("buyer-pruthuvi")
                    break;
            }

            const liEl = document.createElement("li")
            liEl.classList.add("item")
            liEl.addEventListener("click", function() {
                if (confirm(`Are you sure you want to remove ${itemName}?`)) {
                    const itemToDeleteRef = ref(database, `shoppingList/${itemId}`)
                    remove(itemToDeleteRef)
                }
            })
            liEl.insertAdjacentElement("afterbegin", spanEl)
            liEl.insertAdjacentElement("afterbegin", buttonEl)
            
            shoppingListEl.insertAdjacentElement("beforeend", liEl)
        })
    } else {
        shoppingListEl.innerHTML = "<li>There are no items in the shopping list</li>"
    }
})

function clearShoppingList() {
    shoppingListEl.innerHTML = ""
}