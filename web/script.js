
let main_div = document.getElementById("sub")
var newField, current_div_selection
let right_div = document.getElementById("rightDiv")
let remove_button_variable = 0;
let col_names_selection = 'add_columns_'
function addMore(){
    newDiv = document.createElement('div');
    newDiv.setAttribute('id',`sub_div_${remove_button_variable}`)
    newDiv.setAttribute('class',`remove_class_${remove_button_variable} sub_div`)
    newDiv.setAttribute('onclick',`setCurrentDiv(${remove_button_variable})`)
    current_div_selection = `add_columns_${remove_button_variable}`
    main_div.appendChild(newDiv);
    sub_main_div = document.getElementById(`sub_div_${remove_button_variable}`)
// Column name
    newField  = document.createElement('input');
    newField.setAttribute('type','text');
    newField.setAttribute('id',`add_column_${remove_button_variable}`)
    newField.setAttribute('name',`column_name`);
    newField.setAttribute('class',`remove_class_${remove_button_variable} inputclass`);
    newField.setAttribute('size',50);
    newField.setAttribute('placeholder','Column Name');
    newField.setAttribute('onclick','columnNameSelection(this.id)')
    sub_main_div.appendChild(newField);
    

// Column names
    newField = document.createElement('input');
    newField.setAttribute('type','text');
    newField.setAttribute('id',`add_columns_${remove_button_variable}`)
    newField.setAttribute('onclick',`setCurrentDiv(${remove_button_variable})`)
    newField.setAttribute('name',`column_names`);
    newField.setAttribute('class',`remove_class_${remove_button_variable} inputclass`);
    newField.setAttribute('size',50);
    newField.setAttribute('onclick','columnNameSelection(this.id)')
    newField.setAttribute('placeholder','Column Names');
    sub_main_div.appendChild(newField);

// Remove Button
    newField = document.createElement('input');
    newField.setAttribute('type','button');
    newField.setAttribute('id',`remove_column_${remove_button_variable}`)
    newField.setAttribute('class',`remove_class_${remove_button_variable}`);
    newField.setAttribute('onclick',"sayHello(this)")
    newField.setAttribute("value","Remove")
    sub_main_div.appendChild(newField);

// BR
    newField = document.createElement('br');
    newField.setAttribute('class',`remove_class_${remove_button_variable}`);
    main_div.appendChild(newField);
    newField = document.createElement('br');
    newField.setAttribute('class',`remove_class_${remove_button_variable}`);
    sub_main_div.appendChild(newField);

    document.getElementById(`sub_div_${remove_button_variable}`).scrollIntoView();

    remove_button_variable ++
  }

// function setCurrentDiv2(input){
//   current_div_selection = input.id
// }
function columnNameSelection(val){
  if (val.includes("columns")){
    col_names_selection = 'add_columns'
  }else {
    col_names_selection = 'add_column'
  }

}

function setCurrentDiv(div_clicked){
  console.log(col_names_selection)
  current_div_selection = `${col_names_selection}_${div_clicked}`
  console.log(current_div_selection)

}

function sendColumnNameToInput(column_name){

  console.log(column_name.value)
  let current_column_names = document.getElementById(current_div_selection)
  if (current_column_names.value.length > 0 && col_names_selection === 'add_columns'){
    document.getElementById(current_div_selection).value = `${document.getElementById(current_div_selection).value},${column_name.value}`
  }
  else{
    document.getElementById(current_div_selection).value = column_name.value
  }
  

}



function addColumnNameButtons(column_name){
  new_column_button = document.createElement('input');
  new_column_button.setAttribute('type','button');
  new_column_button.setAttribute('value',column_name)
  new_column_button.setAttribute('id',column_name)
  new_column_button.setAttribute('class','all_column_names')
  new_column_button.setAttribute('onclick','sendColumnNameToInput(this)')
  console.log(column_name)
  right_div.appendChild(new_column_button)

}



function sayHello(button){
    console.log(button.className)
    document.querySelectorAll(`.${button.className}`).forEach(el => el.remove());
    
}

// document.querySelector("#add_button").addEventListener('click', sayHello)



var all_column_names;
function getFiles(){
  eel.selectFiles("Hello from js")(function(ret){all_column_names= ret});
};

function sendColumnsPy(){
  let column_names2send = document.getElementsByName("column_names")
  let column_name2send = document.getElementsByName("column_name")
  let string_column_names = ""
  for (let i= 0; i < column_names2send.length; i++){
    string_column_names += `:::${column_names2send[i].value}`
  }
  let string_column_name = ""
  for (let i= 0; i < column_name2send.length; i++){
    string_column_name += `:::${column_name2send[i].value}`
  }

  eel.logColumnNames(string_column_name,string_column_names);
}

function submitFiles(){
  all_column_names = all_column_names.split(":::")
  all_column_names.sort()


  for (let i= 0; i < all_column_names.length; i++){
    addColumnNameButtons(all_column_names[i]);
  }
   document.getElementById("welcome").style.display = "none"
   document.getElementById("combine").style.display = "inline"
   document.getElementById("rightDiv").style.display = "inline"

}

for (let i= 0; i < all_column_names.length; i++){
  alert(all_column_names[i]);
}

console.log(all_column_names)