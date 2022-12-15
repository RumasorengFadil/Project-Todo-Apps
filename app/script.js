"use strict"
const key = "users";
let todos = [];
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
const makeFormElement = function(typeInput,namaLabel = null){
    const br = document.createElement("br");
    const label = document.createElement("label");
    label.classList.add(".form__label");
    label.textContent = namaLabel;

    const input = document.createElement("input");
    input.classList.add(`form__${typeInput == "submit" ? typeInput : "input"}`);
    input.setAttribute("required", true);
    input.setAttribute("type",typeInput);

    const formElement = document.createElement("div");
    formElement.classList.add("form__elemen");
    if(label !== null){
        formElement.append(label,br,input);
    }else{
        formElement.append(br,input);
    }
    return formElement;
}
const makePageEdit = function(todoObject,judul,penulis,tahun){
    const formElementJudul = makeFormElement("text","Judul");
    const formElementPenulis = makeFormElement("text","Penulis");
    const formElementTahun = makeFormElement("number","Tahun");
    const formElementSubmit = makeFormElement("submit");

    const inputJudul = formElementJudul.lastChild;
    const inputPenulis = formElementPenulis.lastChild;
    const inputTahun = formElementTahun.lastChild;

    const form = document.createElement("form");
    form.append(formElementJudul,formElementPenulis,formElementTahun,formElementSubmit);

    const buttonClose = document.createElement("img");
    buttonClose.classList.add("edit-todo__icn-close");
    buttonClose.setAttribute("src","app/assets/Icon/x.svg");

    const pageEdit = document.createElement("div");
    pageEdit.classList.add("edit-todo","hidden");
    pageEdit.append(buttonClose,form);

    buttonClose.addEventListener("click",function(e){
        switchPageEdit(todoObject);
    })
    document.addEventListener("scroll",function(){
        if(pageEdit){
            if(!pageEdit.classList.contains("hidden")){
                switchPageEdit(todoObject);
            }
        }
    })
    form.addEventListener("submit",function(e){
        editTodo({
            ["judul"] : judul,
            ["penulis"] : penulis,
            ["tahun"] : tahun,
            ["inputJudul"] : inputJudul,
            ["inputPenulis"] : inputPenulis,
            ["inputTahun"] : inputTahun
        },todoObject);
        switchPageEdit(todoObject);
        event.preventDefault();
    })
    return pageEdit;

}
const makeOverlay = function(todoObject){
    const overlay = document.createElement("div");
    overlay.classList.add("overlay","hidden");

    overlay.addEventListener("click",function(e){
        switchPageEdit(todoObject);
    })
    return overlay;
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

    const buttonDelete = document.createElement("img");
    buttonDelete.classList.add("card__btn-delete");
    buttonDelete.setAttribute("src","app/assets/Icon/trash.svg");

    const pageEdit = makePageEdit(todoObject,judul,penulis,tahun);
    const overlay = makeOverlay(todoObject);

    content.append(iconEdit,tahun,judul,penulis);
    card.append(content,pageEdit,overlay);
    if(todoObject.apakahSelesai !== true){
        const cards = document.querySelectorAll(".todo-belum .card");
        content.append(buttonSelesai,buttonDelete);
        todoBelum.insertBefore(card, cards[posisi(cards,card)]);
  
        buttonSelesai.addEventListener("click",function(e){
            addToCompltedList(todoObject,e);
        })
        buttonDelete.addEventListener("click", function(e){
            deleteTodo(todoObject,e);
        })
    }else{
        const cards = document.querySelectorAll(".todo-selesai .card");
        const buttonUndo = document.createElement("img");
        buttonUndo.classList.add("card__btn-undo");
        buttonUndo.setAttribute("src","app/assets/Icon/undo.svg")

        content.append(buttonUndo,buttonDelete);
        todoSelesai.insertBefore(card, cards[0]);
        buttonUndo.addEventListener("click", function(e){
            addToUncompletedList(todoObject,e);
        })
        buttonDelete.addEventListener("click", function(e){
            deleteTodo(todoObject,e);
        })
    }
    iconEdit.addEventListener("click",function(e){
        switchPageEdit(todoObject);
    })

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
const deleteTodo = function(todoObject,e){
    e.target.parentElement.parentElement.remove();
    todos.splice(todoObject.id, 1);
    updateData(todoObject.id);
    if(todos.length !== 0) localStorage.setItem(key,JSON.stringify(todos));
    else localStorage.clear();
}
const switchPageEdit = function(todoObject){
    const pageEdit = document.querySelectorAll(".edit-todo");
    const overlay = document.querySelectorAll(".overlay");
    for(let i = 0; i < pageEdit.length; i++){
        if(Number(pageEdit[i].parentElement.id) === todoObject.id){
             pageEdit[i].classList.toggle("hidden");
        }
    }
    for(let i = 0; i < overlay.length; i++){
        if(Number(overlay[i].parentElement.id) === todoObject.id){
            overlay[i].classList.toggle("hidden");
       }
    }
}
const editTodo = function(editObject,todoObject){
    const inputJudul = editObject.inputJudul.value;
    const inputPenulis = editObject.inputPenulis.value;
    const inputTahun = editObject.inputTahun.value;
    const id = todoObject.id;
    todos[id].judul = inputJudul;
    todos[id].penulis = inputPenulis;
    todos[id].tahun = inputTahun;
    localStorage.setItem(key,JSON.stringify(todos));

    editObject.judul.textContent = inputJudul;
    editObject.penulis.textContent = inputPenulis;
    editObject.tahun.textContent = inputTahun;

    todoObject.judul = inputJudul;
    todoObject.penulis = inputPenulis;
    todoObject.tahun = inputTahun;

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
window.addEventListener("load", function(){
    if(this.localStorage.getItem(key) !== null){
        todos = JSON.parse(this.localStorage.getItem(key));
        for(let todo of todos){
            makeTodo(todo);
        }
    }
})
