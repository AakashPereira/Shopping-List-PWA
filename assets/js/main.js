import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
   databaseURL: "https://upskilling-8ad93-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDB = ref(database, "shoppingList")

const addItemBtn = document.getElementById("add-item-btn")

const shoppingForm = document.getElementById("shopping-form")

const itemInput = document.getElementById("item-input")
const buyerInput = document.getElementById("buyer-input")

const itemsContainer = document.getElementById("items-container")

shoppingForm.addEventListener("submit", function(e) {
    e.preventDefault()
    addItemToList(itemInput.value, buyerInput.value)
})

function addItemToList(value, recipient) {
    if(value.length > 0) {
        let entry = {
            item: value,
            buyer: recipient
        }
        push(itemsInDB, entry)
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

        console.log(itemsArray)

        clearContainer()

        for (let i = 0; i < itemsArray.length; i++) {
            let itemID = itemsArray[i][0]
            let itemValue = itemsArray[i][1].item
            let itemBuyer = itemsArray[i][1].buyer
            
            let liEl = document.createElement("li")
            liEl.classList.add("item")

            let nameEl = document.createElement("span")
            nameEl.textContent = itemBuyer
            nameEl.classList.add("buyer")
            
            switch(itemBuyer) {
                case "Adrian":
                    nameEl.classList.add("buyer-adrian")
                    break
                case "Aakash":
                    nameEl.classList.add("buyer-aakash")
                    break
                case "Eraisha":
                    nameEl.classList.add("buyer-eraisha")
                    break
                case "Pruthuvi":
                    nameEl.classList.add("buyer-pruthuvi")
                    break
            }

            liEl.append(nameEl)

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