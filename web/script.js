var inputs_container,
  column_inputs_container_var,
  current_selection,
  all_file_names,
  more_than_one_input,
  key_pressed, selected_action,
  same_cols_on_all_files,
  cols_same;

all_file_names = [];
all_column_names = [];
var already_showed_files = [];

// Extract number from string
function getOnlyNumber(text) {
  return Number(text.replace(/\D/g, ""));
}

// Count number of items occurring in an array
function count(arr) {
  return arr.reduce(
    (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev),
    {}
  );
}

function deleteSquiggler() {
  try {
    random_tag_popping_out_of_nowhere =
      document.getElementsByTagName("editor-squiggler");
    if (random_tag_popping_out_of_nowhere.length > 0) {
      random_tag_popping_out_of_nowhere[0].remove();
    }
  } catch {
    // pass
  }
}

//Disable browse button and submit button during initial window
function showHideWelcomeButton() {
  if (already_showed_files.length === 0) {
    document.getElementById("add-more-button").style.display = "none";
    document.getElementById("welcome-submit-button").style.display = "none";
  } else {
    document.getElementById("add-more-button").style.display = "inline-block";
    document.getElementById("welcome-submit-button").style.display =
      "inline-block";
  }
}

showHideWelcomeButton();
async function getFiles(id) {
  files_and_columns = await eel.selectFiles()(); // Must prefix call with 'await', otherwise it's the same syntax
  //   console.log("Got this from Python: " + n[0]);
  file_names_container = document.getElementById("file-names-container");
  all_file_names = [...new Set(all_file_names)];

  if (id === "browse-button") {
    already_showed_files = [];
    file_names_container.replaceChildren();
    document.getElementById("inputs-container").replaceChildren();
    all_file_names = files_and_columns[0];
    all_column_names = files_and_columns[1];
    cols_same = files_and_columns[2];
    same_cols_on_all_files = files_and_columns[3];
    all_cols_length = all_column_names.length;
  } else {
    same_cols_on_all_files = same_cols_on_all_files.filter((value) => files_and_columns[1].includes(value));
    same_cols_on_all_files.sort();
    all_file_names.push(...files_and_columns[0]);
    all_column_names.push(...files_and_columns[1]);
    all_column_names = [...new Set(all_column_names)];
    cols_same = all_cols_length === all_column_names.length ? "true" : "false";
  }
  cols_same = cols_same === "true" ? true : false;

  // Show file names received
  for (const file_name of all_file_names) {
    if (already_showed_files.includes(file_name) == false) {
      file_name_element = document.createElement("p");
      file_name_element.textContent = `${already_showed_files.length + 1
        }. ${file_name}`;
      file_names_container.appendChild(file_name_element);
      already_showed_files.push(file_name);
    }
  }
  showHideWelcomeButton();
}

let addColumnsFromPython = function () {
  all_column_container_div = document.getElementById("column-names-container");
  all_column_container_div.replaceChildren();
  // Add column names button received from python
  for (let i = 0; i < all_column_names.length; i++) {
    column_name = all_column_names[i];
    column_button = document.createElement("input");
    column_button.setAttribute("type", "button");
    column_button.setAttribute("value", column_name);
    column_button.setAttribute(
      "class",
      "all-column-names-button btn all-col-btn"
    );
    column_button.setAttribute("id", `button_id_${column_name}`);
    column_button.setAttribute("onclick", "sendColumnToInput(this.value)");
    all_column_container_div.appendChild(column_button);
  }
};

//Check Input

function checkInput(ele = 0) {
  //Auto input
  if (
    ele !== 0 &&
    key_pressed !== "backspace" &&
    current_selection.startsWith("column_names_input")
  ) {
    column_inputs_element =
      document.getElementsByClassName("column-names-input");
    column_inputs = [];
    for (let i = 0; i < column_inputs_element.length; i++) {
      el = column_inputs_element[i].value;
      el.split(",").forEach((col) => column_inputs.push(col));
    }
    column_inputs_to_check = all_column_names.filter(
      (col) => column_inputs.includes(col) === false
    );
    column_inputs = column_inputs.filter((col) => col);
    for (const value of ele.value.split(",")) {
      number_of_items_in_all_columns = column_inputs_to_check.filter((col) =>
        col.startsWith(value)
      );
      if (number_of_items_in_all_columns.length === 1) {
        val_suggested = number_of_items_in_all_columns[0];
        current_input = document
          .getElementById(current_selection)
          .value.split(",");
        if (current_input.includes(val_suggested) === false) {
          current_input = current_input.filter((item) => item !== value);
          current_input.push(val_suggested);
          document.getElementById(current_selection).value =
            String(current_input);
        }
      }
    }
    deleteSquiggler();
  }
  //
  more_than_one_input = 0;
  column_names_to_check = document.getElementsByClassName("column-names-input");
  columns_user_has_added = [];
  for (let i = 0; i < column_names_to_check.length; i++) {
    input_string = column_names_to_check[i].value;
    if (input_string.length > 1) {
      input_string.split(",").forEach((el) => {
        columns_user_has_added.push(el);
      });
    }
  }
  column_names_and_frequencies = count(columns_user_has_added);
  // console.log(column_names_and_frequencies)
  for (let i = 0; i < all_column_names.length; i++) {
    el = all_column_names[i];
    if (
      columns_user_has_added.includes(el) &&
      column_names_and_frequencies[el] === 1
    ) {
      document.getElementById(`button_id_${el}`).style.background = "#FFD700"; //yellow
    } else if (!columns_user_has_added.includes(el)) {
      document.getElementById(`button_id_${el}`).style.background = "#E0E0E0"; //grey
    } else {
      document.getElementById(`button_id_${el}`).style.background = "#FF0000"; //red
      more_than_one_input++;
    }
  }
}

function initiateProcessScreen() {
  document.getElementById("welcome-container").style.display = "none";
  document.getElementById("process-screen").style.display = "block";
  cols_same_button = document.getElementById("cols-same-button");
  if (cols_same) {
    cols_same_button.style.background = "#4DFF33";
    cols_same_button.title = "Columns are same on all files";
  } else {
    cols_same_button.style.background = "#FF0000";
    cols_same_button.title = "Columns are not same on all files";
  }
  all_column_names = [...new Set(all_column_names)];
  all_column_names.sort();
  addColumnsFromPython();
  checkInput();
  addMore();
}

function goBack() {
  document.getElementById("welcome-container").style.display = "block";
  document.getElementById("process-screen").style.display = "none";
}

// Set current focus

function setCurrentFocus(id) {
  // console.log(id);
  current_selection = id;
  checkInput();
}

// Send column name to input

function sendColumnToInput(column_name) {
  if (current_selection.includes("column_names_input_")) {
    existing_value_in_column_names_input =
      document.getElementById(current_selection).value;
    existing_value_in_column_names_input_array = document
      .getElementById(current_selection)
      .value.split(",");
    existing_value_in_column_names_input_array =
      existing_value_in_column_names_input_array.filter((e) => e.length > 0);
    if (existing_value_in_column_names_input.length > 0) {
      if (existing_value_in_column_names_input_array.includes(column_name)) {
        existing_value_in_column_names_input_array =
          existing_value_in_column_names_input_array.filter(
            (e) => e !== column_name
          );
        // document.getElementById(current_selection).value = existing_value_in_column_names_input.replace(new RegExp("\\b"+column_name+"\\b"), "");
        // existing_value_in_column_names_input = document.getElementById(current_selection).value
        // document.getElementById(current_selection).value = existing_value_in_column_names_input.replace(",,",",").replace(/(^,)|(,$)/g, "")
        document.getElementById(current_selection).value = String(
          existing_value_in_column_names_input_array
        );
      } else {
        existing_value_in_column_names_input_array.push(column_name);
        document.getElementById(current_selection).value = String(
          existing_value_in_column_names_input_array
        );
      }
    } else {
      document.getElementById(current_selection).value = column_name;
    }
  } else {
    document.getElementById(current_selection).value = column_name;
  }
  // Check after sending to input
  checkInput();
}

column_inputs_container_var = 1;
inputs_container = document.getElementById("inputs-container");
function addMore() {
  deleteSquiggler();
  // inputs_container.remove("ms-editor-squiggles-container"); //this was randomly popping up and causing layout issues
  // adding header input
  header_input = document.createElement("input");
  header_input.setAttribute("type", "input");
  header_input.setAttribute("placeholder", "Output Column");
  header_input.setAttribute("oninput", "checkInput()");
  // header_input.setAttribute("onkeydown","addAnotherInput()")
  header_input.setAttribute(
    "id",
    `header_input_${column_inputs_container_var}`
  );
  header_input.setAttribute("onclick", "setCurrentFocus(this.id)");
  header_input.setAttribute(
    "class",
    `headers-input rm_${column_inputs_container_var} process-input-field`
  );

  inputs_container.appendChild(header_input);

  // adding column names
  column_names_input = document.createElement("input");
  column_names_input.setAttribute("type", "input");
  column_names_input.setAttribute("placeholder", "Input Columns");
  column_names_input.setAttribute(
    "id",
    `column_names_input_${column_inputs_container_var}`
  );
  column_names_input.setAttribute("onclick", "setCurrentFocus(this.id)");
  column_names_input.setAttribute("oninput", "checkInput(this)");
  column_names_input.setAttribute(
    "class",
    `column-names-input rm_${column_inputs_container_var} process-input-field`
  );
  inputs_container.appendChild(column_names_input);

  // adding remove button
  remove_button = document.createElement("input");
  remove_button.setAttribute("type", "button");
  remove_button.setAttribute("value", "Remove");
  remove_button.setAttribute(
    "id",
    `remove_button_${column_inputs_container_var}`
  );
  remove_button.setAttribute(
    "class",
    `remove-button rm_${column_inputs_container_var} btn`
  );
  remove_button.setAttribute("onclick", "removeInputDiv(this)");
  inputs_container.appendChild(remove_button);

  // Setting focus to current column names input
  current_selection = `header_input_${column_inputs_container_var}`;

  // set focus to current div when user press add
  remove_button.scrollIntoView();
  header_input.focus();

  // Check Input
  checkInput();

  // adding column_inputs_container_var
  column_inputs_container_var++;
}

function addAllColumns() {
  cols_to_fill = cols_same ? all_column_names : same_cols_on_all_files;
  input_field = document.getElementsByClassName("process-input-field")
  last_input_field = input_field[input_field.length - 1]
  column_inputs_container_var = getOnlyNumber(last_input_field.id) + 1;
  // console.log(same_cols_on_all_files)
  for (let i = 0; i < cols_to_fill.length; i++) {
    column = cols_to_fill[i];
    document.getElementById(
      `column_names_input_${column_inputs_container_var - 1}`
    ).value = column;
    document.getElementById(
      `header_input_${column_inputs_container_var - 1}`
    ).value = column;
    if (i < all_column_names.length - 1) {
      addMore();
    }
  }
  checkInput();

}

// Notice enter key
function keydown(evt) {
  if (evt.keyCode === 8) {
    key_pressed = "backspace";
  } else if (
    evt.shiftKey &&
    evt.keyCode === 13 &&
    document.getElementById("welcome-container").style.display === "none"
  ) {
    column_names_input_check =
      document.getElementsByClassName("column-names-input");
    inputs_last_element =
      column_names_input_check[column_names_input_check.length - 1];
    current_selection_num = getOnlyNumber(current_selection);
    if (current_selection.includes("header_input")) {
      current_selection = `column_names_input_${current_selection_num}`;
      document.getElementById(current_selection).focus();
    } else if (
      current_selection.includes("column_names_input") &&
      current_selection === inputs_last_element.id
    ) {
      addMore();
    } else {
      next_sibling = document.getElementById(current_selection).nextSibling;
      next_sibling = document.getElementById(next_sibling.id).nextSibling;
      next_sibling.focus();
      current_selection = next_sibling.id;
    }
  } else if (evt.keyCode !== 8) {
    key_pressed = "not backspace";
  }
}
document.onkeydown = keydown;

// Remove button function
function removeInputDiv(button) {
  number_of_inputs = document.getElementsByClassName(`process-input-field`);
  if (number_of_inputs.length > 2) {
    rm_class = `${button.className}`.split(" ");
    rm_class = rm_class[rm_class.length - 2];
    document.querySelectorAll(`.${rm_class}`).forEach((el) => el.remove());
    // Check Input
    checkInput();
  }
}

// actual submit function
async function submitFiles(one_go = false, clean_actions) {
  log_cleaning = []
  for (const act in clean_actions) {
    if (act.includes("rnr896#")) { log_cleaning.push("Removing Blanks") }
    else if (act.includes()) { log_cleaning.push("Removing Duplicates") }

  }
  if (one_go === true) {
    headers_input = all_column_names;
    column_names = all_column_names;
  }
  document.getElementById("process-screen").style.display = "none";
  document.getElementById("end-screen").style.background = "#FFFFFF";
  document.getElementById("end-screen").style.display = "block";
  document.getElementById("end-process-log").textContent =
    "Starting combining process";

  for (let i = 0; i < all_file_names.length; i++) {
    file = all_file_names[i];
    file_status = await eel.receiveInputs(file, headers_input, column_names)();
    document.getElementById("end-process-log").textContent = file_status;
    // console.log(file_status);
  }
  for (const val of log_cleaning) {
    document.getElementById("end-process-log").textContent = val;
  }

  final_status = await eel.finalCombine(clean_actions)();
  if (final_status == "Saving files cancelled") {
    document.getElementById("end-process-log").textContent = final_status;
    document.getElementById("end-screen").style.background = "#FF0000";
  } else {
    document.getElementById("end-process-log").textContent = final_status;
    document.getElementById("end-screen").style.background = "#228B22";
  }
}


// Pre process screen elements adder
function selectAction(sel) {
  selected_action = sel.options[sel.selectedIndex].text
}

function addSelectedColumns() {
  headers_input = getHeadersInput();

  selected_column_container_div = document.getElementById("pre-process-selected-columns");
  selected_column_container_div.replaceChildren();
  // Add column names button received from python
  for (let i = 0; i < headers_input.length; i++) {
    column_name = headers_input[i];
    column_button = document.createElement("input");
    column_button.setAttribute("type", "button");
    column_button.setAttribute("value", column_name);
    column_button.setAttribute(
      "class",
      "all-column-names-button btn all-col-btn selected-columns"
    );
    column_button.setAttribute("id", `sel_button_id_${column_name}`);
    // column_button.setAttribute("onclick", "sendColumnToInput(this.value)");
    selected_column_container_div.appendChild(column_button);
  }
};

function cleanRMSubClass(val) {
  // console.log(val)
  document.querySelectorAll(`.${val}`).forEach((el) => el.remove());

}

function addRmButton4Clean(val) {
  remove_button = document.createElement("input");
  remove_button.setAttribute("type", "button");
  remove_button.setAttribute("value", "Remove");
  remove_button.setAttribute(
    "id",
    `remove_button_${val}`
  );
  remove_button.setAttribute("onclick", `cleanRMSubClass("${val}")`)
  return remove_button
}

function addSubPreProcess(action, placeholder) {
  main_pre_process = document.getElementById("main-pre-process")
  sub_pre_process = document.createElement("div")
  sub_pre_process.setAttribute("class", `sub-pre-process_${column_inputs_container_var} spp`)
  action_head = document.createElement("h3")
  action_head.innerHTML = action
  action_inputs = document.createElement("input")
  action_inputs.setAttribute("class", "pre-process-input-field")
  action_inputs.setAttribute("size", "20")
  action_inputs.setAttribute("placeholder", placeholder)
  remove_button = addRmButton4Clean(`sub-pre-process_${column_inputs_container_var}`)
  sub_pre_process.appendChild(action_head)
  sub_pre_process.appendChild(action_inputs)
  sub_pre_process.appendChild(remove_button)
  main_pre_process.appendChild(sub_pre_process)
  column_inputs_container_var++


}

function addAction() {
  if (selected_action === "Remove Duplicates") {
    sub_pre_process = addSubPreProcess("Remove Duplicates", "Write columns to be considered for removing duplicates")
  } else if (selected_action === "Remove Blank Rows") {
    sub_pre_process = addSubPreProcess("Remove Blank Rows", "Write columns to be considered for removing blanks")
  } else if (selected_action === "Remove Special Characters") {
    sub_pre_process = addSubPreProcess("Remove Special Characters", "Write columns to be considered for removing special characters")
  }
}


function checkBoxCheck() {
  pre_check_box = document.getElementById("pre-pro-check-box")
  if (pre_check_box.checked) {
    document.getElementById("combine-button").value = "Next";
  } else {
    document.getElementById("combine-button").value = "Combine";
  }
}

// Get header inputs
function getHeadersInput() {
  headers_input_elements = document.getElementsByClassName("headers-input");
  headers_input = [];
  for (let i = 0; i < headers_input_elements.length; i++) {
    headers_input.push(headers_input_elements[i].value);
  }
  return headers_input;
}


// Send user inputs to python

function sendUserInputToPython(but) {
  if (but.value === "Combine") {
    document.getElementById("pre-process-screen").style.display = "none";
    // Check values from pre-process
    if (but.classList.contains("pre-pro-combine")) {
      pass_clean_actions = []
      sub_pre_process = document.getElementsByClassName("spp")
      for (const ele of sub_pre_process) {
        // console.log(ele)
        if (ele.firstChild.innerHTML === "Remove Duplicates") {
          rem_values = ele.childNodes[1]
          // console.log(`${rem_values.value}`)
          pass_clean_actions.push(`rmd896#${rem_values.value}`)
        } else if (ele.firstChild.innerHTML === "Remove Blank Rows") {
          rem_values = ele.childNodes[1]
          // console.log(`${rem_values.value}`)
          pass_clean_actions.push(`rnr896#${rem_values.value}`)
        } else if (ele.firstChild.innerHTML === "Remove Special Characters") {
          rem_values = ele.childNodes[1]
          // console.log(`${rem_values.value}`)
          pass_clean_actions.push(`rsc896#${rem_values.value}`)
        }
      }
      // rm = document.getElementsByClassName("rmd-pp")[0]
      // console.log(rm.value)
    }
    column_names_elements = document.getElementsByClassName("column-names-input");
    column_names = [];
    for (let i = 0; i < column_names_elements.length; i++) {
      column_names.push(column_names_elements[i].value);
    }
    headers_input = getHeadersInput();
    all_file_names = [...new Set(all_file_names)];
    valid_submit = true;
    valid_column_names = true;
    for (let i = 0; i < column_names.length; i++) {
      if (headers_input[i] === "" || column_names[i] === "") {
        valid_submit = false;
      }
      each_column_input_elements = column_names[i].split(",");
      for (let j = 0; j < each_column_input_elements.length; j++) {
        if (all_column_names.includes(each_column_input_elements[j]) === false) {
          valid_column_names = false;
        }
      }
    }
    //Check to ensure no value has been entered
    all_user_inputs = document.getElementsByClassName("process-input-field");
    number_of_all_user_inputs = 0;
    for (const el of all_user_inputs) {
      if (el.value.length > 0) number_of_all_user_inputs++;
    }

    //check to see if user has entered column input more than once
    checkInput();
    //
    if (cols_same && valid_submit === false && number_of_all_user_inputs == 0) {
      submitFiles(true, pass_clean_actions);
    } else if (valid_submit === false || valid_column_names === false) {
      alert("Please fill all input fields properly");
    } else if (more_than_one_input > 0) {
      alert("You have entered a column input more than once");
    } else if (valid_column_names === false) {
      alert("Please fill column names input field with valid inputs");
      // If checks have passed data will start from here
    } else {
      submitFiles(false, pass_clean_actions);
    }
  } else {
    document.getElementById("process-screen").style.display = "none";

    // Fill with selected columns
    addSelectedColumns();

    document.getElementById("pre-process-screen").style.display = "block";

  }

  // final_status = await eel.finalCombine()();
}

function goBackToProcess() {
  document.getElementById("process-screen").style.display = "block";
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("pre-process-screen").style.display = "none";
}
