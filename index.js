import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref ,push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-fd8f5-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")


addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue !== ""){
        push(shoppingListInDB, inputValue)
        clearInputFieldEl()
        inputFieldEl.placeholder = "Shopping-Item"
    }
    else {
        inputFieldEl.placeholder = "Enter Item Name";
    }
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists())  {
      let itemsArray = Object.entries(snapshot.val())
      clearShoppingListEl()
      for (let item in itemsArray) {
        let currentItem = itemsArray[item]
        appendItemToShoppingListEl(currentItem)
      }
    } else {
      shoppingListEl.innerHTML = "No items here... yet."
    }
  })

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    newEl.id= itemID
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDb = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDb)
    })
    shoppingListEl.append(newEl)
}
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}
