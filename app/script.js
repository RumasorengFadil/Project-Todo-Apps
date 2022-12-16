"use strict"
const key = "users";
let todos = [];
const overlay = document.querySelector(".overlay");
const editPopup = document.querySelector(".form-cn-edit");
const editCloseBtn = document.querySelector(".form-cn-edit__icn-close");
const formEdit = document.querySelector(".form-edit");
const popupALert = document.querySelector(".popup-alert");
const popupConfirm = document.querySelector(".popup-confirm");
const todo = document.querySelector("main");
const btnCancel = document.querySelector(".popup__btn-cancel");
const btnDelete = document.querySelector(".popup__btn-delete");
const btnOke = document.querySelector(".popup__btn-oke");
const makeObject = function(inputJudul,inputPenulis,inputTahun,apakahSelesai,id){
    return {
        judul : inputJudul,
        penulis: inputPenulis,
        tahun : inputTahun,
        ["apakahSelesai"] : apakahSelesai,
        ["id"] : id
    }
}
const getId = function(){
    const todoObject = JSON.parse(localStorage.getItem(key));
    return todoObject[todoObject.length - 1].id + 1;
}
const imporToLocal = function(todoObject){
    if(localStorage.getItem(key) !== null){
        todoObject.id = getId();
        todos = JSON.parse(localStorage.getItem(key));
        todos.push(todoObject);
        localStorage.setItem(key,JSON.stringify(todos));        
    }else{
        todoObject.id = 0;
        todos.push(todoObject);
        localStorage.setItem(key,JSON.stringify(todos));
    }
}
const posisi = function(cards,card){
    for(let i = 0; i < cards.length; i++){
       if(card.id > cards[i].id) continue;
       else{
           return i;
       }
    }
    return card.id;
}
const makeTodo = function(todoObject){
    const todoBelum = document.querySelector(".todo-belum");
    const todoSelesai = document.querySelector(".todo-selesai");
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = todoObject.id;

    const iconEdit = document.createElement("img");
    iconEdit.classList.add("card__icn-edit");
    iconEdit.setAttribute("src","app/assets/icon/edit.svg");

    const tahun = document.createElement("p");
    tahun.classList.add("card__tahun");
    tahun.textContent = todoObject.tahun;

    const judul = document.createElement("h5");
    judul.classList.add("card__judul");
    judul.textContent = todoObject.judul;

    const penulis = document.createElement("figcaption");
    penulis.classList.add("card__penulis");
    penulis.textContent = todoObject.penulis;
    
    const content = document.createElement("div");
    content.classList.add("card__content");

    const buttonSelesai = document.createElement("img");
    buttonSelesai.classList.add("card__btn-selesai");
    buttonSelesai.setAttribute("src","app/assets/Icon/check.svg");

    const icnDelete = document.createElement("img");
    icnDelete.classList.add("card__btn-delete");
    icnDelete.setAttribute("src","app/assets/Icon/trash.svg");

    content.append(iconEdit,tahun,judul,penulis);
    card.append(content);
    if(todoObject.apakahSelesai !== true){
        const cards = document.querySelectorAll(".todo-belum .card");
        content.append(buttonSelesai,icnDelete);
        todoBelum.insertBefore(card, cards[posisi(cards,card)]);
  
        buttonSelesai.addEventListener("click",function(e){
            addToCompltedList(todoObject,e);
        })
        icnDelete.addEventListener("click", function(){
            show([overlay, popupConfirm]);
            content.append(popupConfirm);
        })
    }else{
        const cards = document.querySelectorAll(".todo-selesai .card");
        const buttonUndo = document.createElement("img");
        buttonUndo.classList.add("card__btn-undo");
        buttonUndo.setAttribute("src","app/assets/Icon/undo.svg")

        content.append(buttonUndo,icnDelete);
        todoSelesai.insertBefore(card, cards[0]);
        buttonUndo.addEventListener("click", function(e){
            addToUncompletedList(todoObject,e);
        })
        icnDelete.addEventListener("click", function(){
            show([overlay, popupConfirm]);
            content.append(popupConfirm);
        })
    }
    iconEdit.addEventListener("click", function(){
        show([overlay,editPopup]);
        content.append(editPopup);
    });
}
const addToCompltedList = function(todoObject,e){
    e.target.parentElement.parentElement.remove();
    todoObject.apakahSelesai = true;
    todos[todoObject.id].apakahSelesai = true;
    localStorage.setItem(key,JSON.stringify(todos));
    makeTodo(todoObject);
}
const addToUncompletedList = function(todoObject,e){
    e.target.parentElement.parentElement.remove();
    todoObject.apakahSelesai = false;
    todos[todoObject.id].apakahSelesai = false;
    localStorage.setItem(key,JSON.stringify(todos));
    makeTodo(todoObject);
}
const updateData = function(id){
    const cards = document.querySelectorAll(".card");
    for(let i = id; i < todos.length; i++){
        todos[i].id -= 1;
        cards[i].id -= 1;
    }
}
const show = function(el){ 
    if(typeof el === "object") [el].flat().forEach(e => e.classList.remove("hidden"));
}
const hidden = function(el){
    if(typeof el === "object") [el].flat().forEach(e => e.classList.add("hidden"));
}
const deleteTodo = function(todoObject,e){
    e.target.closest(".card").remove();
    todos.splice(todoObject.id, 1);
    updateData(todoObject.id);
    if(todos.length !== 0) localStorage.setItem(key,JSON.stringify(todos));
    else localStorage.clear();
}
const deleteCard = function(){
    const cards = document.querySelectorAll(".card");
    for(let i = 0; i < cards.length; i++){
        cards[i].remove();
    }
}
const tampilkanHasilPencarian = function(inputJudul){
    for(let i = 0; i < todos.length; i++){
        const carikan = todos[i].judul.slice(0,inputJudul.length).toLowerCase();
        console.log(carikan);
        if(carikan === inputJudul){
            makeTodo(todos[i]);
        }
    }
}
const searchTodo = function(){
    const inputSearch = document.getElementById("inputSearch");
    inputSearch.addEventListener("input", function(){
        const inputJudul = inputSearch.value.toLowerCase();
        deleteCard();
        tampilkanHasilPencarian(inputJudul);
    })
}
const addTodo = function(){
    const inputJudul = document.getElementById("inputJudul").value;
    const inputPenulis = document.getElementById("inputPenulis").value;
    const inputTahun = document.getElementById("inputTahun").value;
    const apakahSelesai = document.getElementById("inputStatus").checked;
    const id = null;
    const todoObject = makeObject(inputJudul,inputPenulis,inputTahun,apakahSelesai,id);

    imporToLocal(todoObject);
    makeTodo(todoObject);
}
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("form").addEventListener("submit",function(){
        addTodo();
        event.preventDefault();
    })
    searchTodo();
})
formEdit.addEventListener("submit", function(e){
    const card = e.target.closest(".card");
    const cardId = Number(card.id);
    const editPopup = e.target.closest(".form-cn-edit");
    const inputJudul = editPopup.querySelector(".form__input[name=inputJudul]").value;
    const inputPenulis = editPopup.querySelector(".form__input[name=inputPenulis]").value;
    const inputTahun = editPopup.querySelector(".form__input[name=inputTahun]").value;
    const judul = card.querySelector(".card__judul");
    const penulis = card.querySelector(".card__penulis");
    const tahun = card.querySelector(".card__tahun");
        
    judul.textContent = inputJudul;
    penulis.textContent = inputPenulis;
    tahun.textContent = inputTahun;
    
    todos[cardId].judul = inputJudul;
    todos[cardId].penulis = inputPenulis;
    todos[cardId].tahun = inputTahun;
    localStorage.setItem(key,JSON.stringify(todos));

    hidden([editPopup, overlay]);
    event.preventDefault();
})
window.addEventListener("load", function(){
    if(this.localStorage.getItem(key) !== null){
        todos = JSON.parse(this.localStorage.getItem(key));
        for(let todo of todos){
            makeTodo(todo);
        }
    }
})

btnDelete.addEventListener("click", function(e){
    const card = e.target.closest(".card");
    const todoObject = todos[card.id];
    hidden([popupConfirm, overlay]);
    deleteTodo(todoObject,e);
    show([popupALert,overlay]);
})
btnCancel.addEventListener("click", hidden.bind(hidden,[popupConfirm, overlay]));
btnOke.addEventListener("click", hidden.bind(hidden,[popupALert,overlay]));
editCloseBtn.addEventListener("click", hidden.bind(hidden,[overlay,editPopup,popupConfirm]));
overlay.addEventListener("click", hidden.bind(hidden,[overlay,editPopup,popupConfirm]));

document.addEventListener("scroll",function(){
    hidden([editPopup,overlay,popupALert,popupConfirm]);
})