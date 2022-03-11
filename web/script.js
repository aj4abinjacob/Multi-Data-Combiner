var add_more_fields = document.querySelector(".add_more_button");
var remove_button = document.querySelector(".remove_more");
var survey_options = document.getElementById('divLeft');
var submit_button = document.getElementById("submit_button")
var x = 0
function add_more(){
    var newField = document.createElement('input');
    newField.setAttribute('type','text');
    newField.setAttribute('name',`survey_options_${x}`);
    newField.setAttribute('class','survey_options');
    newField.setAttribute('siz',50);
    newField.setAttribute('placeholder','Column Name');
    survey_options.appendChild(newField);
    x ++
  }
var rightDiv = document.getElementById('divRight');
 function add_og_column(value){
    var newField = document.createElement('button');
    newField.setAttribute('type','button');
    newField.setAttribute('content','fdfdf')
    newField.setAttribute('id',value);
    newField.textContent = value;
    rightDiv.appendChild(newField);
  }
let test_column_array = ['root','Author','Column']

for (index in test_column_array){
    add_og_column(test_column_array[index])
}

let input_tags;
function remove_field(){

    input_tags = survey_options.getElementsByClassName('survey_options');
    if (input_tags.length > 0){
    x --
    survey_options.removeChild(input_tags[(input_tags.length - 1)]);
    }
}

// remove_fields.onclick = function(){
//     var input_tags = survey_options.getElementsByTagName('input');
//     if(input_tags.length > 2) {
//       survey_options.removeChild(input_tags[(input_tags.length) - 1]);
//     }

add_more_fields.addEventListener('click',add_more);
remove_button.addEventListener('click',remove_field)
submit_button.addEventListener('click', function() {
    for (index in document.getElementsByClassName("survey_options")){
        let item = document.getElementsByClassName("survey_options")[index].value;
        console.log(item);
    }
})
