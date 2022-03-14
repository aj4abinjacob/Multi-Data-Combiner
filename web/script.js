
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
    newField.setAttribute('class',`remove_class_${remove_button_variable} inputclass submitcol2check`);
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
    newField.setAttribute('class',`remove_class_${remove_button_variable} inputclass col2check`);
    newField.setAttribute('size',50);
    newField.setAttribute('onclick','columnNameSelection(this.id)')
    newField.setAttribute('placeholder','Column Names');

    sub_main_div.appendChild(newField);

// Remove Button
    newField = document.createElement('input');
    newField.setAttribute('type','button');
    newField.setAttribute('id',`remove_column_${remove_button_variable}`)
    newField.setAttribute('class',`remove_class_${remove_button_variable}`);
    newField.setAttribute('onclick',"removeButton(this)")
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

  //running once to change ugly ui
addMore()


function columnNameSelection(val){
  if (val.includes("columns")){
    col_names_selection = 'add_columns'
  }else {
    col_names_selection = 'add_column'
  }

}

function setCurrentDiv(div_clicked){
  // console.log(col_names_selection)
  current_div_selection = `${col_names_selection}_${div_clicked}`
  // console.log(current_div_selection)

}

function sendColumnNameToInput(column_name){

  // console.log(column_name.value)
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
  new_column_button.setAttribute('id',`btn_id_${column_name}`)
  new_column_button.setAttribute('class','all_column_names')
  new_column_button.setAttribute('onclick','sendColumnNameToInput(this)')
  // console.log(column_name)
  right_div.appendChild(new_column_button)

}



function removeButton(button){
    // console.log(button.className)
    document.querySelectorAll(`.${button.className}`).forEach(el => el.remove());
    
}

function show_files_selected(files){
  pre_tag_for_files = document.getElementById("pre_tag_for_files")
  document.getElementById("allfilesh2").textContent = "All Files Selected"

  files = files.split(",")
  files.forEach((el)=>{
    console.log(el)
    pre_tag_for_files.textContent += `\n${el}`
  })

}


//Running this function while clicking browse button
var all_column_names;
function getFiles(){
  eel.selectFiles()(function(ret){
    all_column_names = ret.split("::::")[0]
    file_names_from_python = ret.split("::::")[1]
    show_files_selected(file_names_from_python)
    // console.log(all_column_names)
    // if (all_column_names.includes("date")){alert("date")}
  });
};


function submitFiles(){
  
  all_column_names = all_column_names.split(":::")
  all_column_names.sort()
  for (let i= 0; i < all_column_names.length; i++){
    addColumnNameButtons(all_column_names[i]);
  }
   document.getElementById("welcome").style.display = "none"
   document.getElementById("combine").style.display = "inline"
   document.getElementById("rightDiv").style.display = "inline"
   document.getElementById("firstsub").style.display = "inline"


}

var column_names2send

var run_while_loop = true




function sendColumnsPy(){
  column_names2send = document.getElementsByName("column_names")
  let column_name2send = document.getElementsByClassName("submitcol2check")
  let string_column_names = ""
  column_name2send_string = ""
  for(index in column_name2send){
    if (typeof column_name2send[index].value === "string"){column_name2send_string += column_name2send[index].value}}
  // column_name2send.forEach((el)=> { column_name2send_string+el.value})
  console.log(column_name2send_string)
  if (column_name2send_string.length < 1){alert("Please enter at least one column");
}else {

  for (let i= 0; i < column_names2send.length; i++){
    string_column_names += `:::${column_names2send[i].value}`
  }
  let string_column_name = ""
  for (let i= 0; i < column_name2send.length; i++){
    string_column_name += `:::${column_name2send[i].value}`
  }

  eel.logColumnNames(string_column_name,string_column_names);
}
}

var columns2check = document.getElementsByClassName("col2check")
function columCheck(){
//  console.log(all_column_names)
  all_column_names.forEach((el)=>{
    columns2check = document.getElementsByClassName("col2check")
    col2checkarray = []
    for (let i= 0; i < columns2check.length; i++){
      columns2check[i].value.split(",").forEach((val)=>{col2checkarray.push(val)})
    }
    if (col2checkarray.includes(el)){
      document.getElementById(`btn_id_${el}`).style.color = "red"}
    else{
      document.getElementById(`btn_id_${el}`).style.color = "black"
    }
  })
}




for (let i = 1; i < 100000; i++) {
  setTimeout(function timer() {
    // console.log("hello world");
    // document.getElementById(`btn_id_date`).style.color = "red"
    columCheck();
  }, i * 5000);
}