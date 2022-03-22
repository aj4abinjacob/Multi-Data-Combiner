from tkinter.filedialog import asksaveasfilename
from tkinter.filedialog import askopenfilenames
import eel
from numpy import absolute
import pandas as pd
import numpy
from tkinter import Tk
from tkinter import Label
import time


def readDf(file):
    if file.endswith(".csv") or file.endswith(".tsv"):
        df = pd.read_csv(file, low_memory=False)
    elif file.endswith(".xlsx") or file.endswith(".xls"):
        df = pd.read_excel(file)
    return df


def readDfCols(file):
    if file.endswith(".csv") or file.endswith(".tsv"):
        df = pd.read_csv(file, low_memory=False, nrows=10)
    elif file.endswith(".xlsx") or file.endswith(".xls"):
        df = pd.read_excel(file, nrows=10)
    return df


file_names = []


@eel.expose
def selectFiles():
    global file_names
    root = Tk()
    root.wm_attributes("-topmost", 1)
    root.wm_state("iconic")
    file_names = askopenfilenames(
        title="Open 'csv','xls', or 'xlsx' files", parent=root
    )
    root.destroy()
    extensions = ["csv", "tsv", "xlsx", "xls"]
    file_names = list(file_names)
    for file in file_names:
        if file.endswith(tuple(extensions)) == False:
            file_names.remove(file)
    all_columns = []
    df_columns_list = []
    first_df_cols = set()
    cols_same = 0
    for index, file in enumerate(file_names):
        df = readDfCols(file)
        df_columns_list.append(set(df.columns))
        if index == 0:
            first_df_cols = set(df.columns)
        elif first_df_cols != set(df.columns):
            cols_same += 1
        for x in df.columns:
            all_columns.append(x)
    cols_same = "true" if cols_same == 0 else "false"
    if len(file_names) == 1:
        cols_same = "true"
    all_columns = list(dict.fromkeys(all_columns))
    same_col_list = list(set.intersection(*df_columns_list))
    files_and_columns = [file_names, all_columns, cols_same, same_col_list]
    return files_and_columns


all_dataframes = pd.DataFrame()


@eel.expose
def receiveInputs(file_name, headers_input, column_names):
    df = readDf(file_name)
    for index, input in enumerate(column_names):
        for col_input in input.split(","):
            df.rename(columns={col_input: headers_input[index]}, inplace=True)
    for col in headers_input:
        if col not in df.columns:
            df[col] = numpy.nan
    df = df[headers_input]
    global all_dataframes
    all_dataframes = pd.concat([all_dataframes, df])
    del df
    return f"Done combining {file_name}"


@eel.expose
def finalCombine():
    global all_dataframes
    df = all_dataframes
    root = Tk()  # this is to close the dialogue box later
    root.wm_attributes("-topmost", 1)
    root.wm_state("iconic")

    save_file = asksaveasfilename(filetypes=[("All files", "*.*")])
    if len(save_file) > 0:
        if save_file.endswith(".xlsx"):
            df.to_excel(save_file, index=False)
        elif save_file.endswith(".xls"):
            df.to_excel(save_file, index=False)
        elif save_file.endswith(".tsv"):
            df.to_csv(save_file, index=False)
        elif save_file.endswith(".csv"):
            df.to_csv(save_file, index=False)
        else:
            save_file = save_file.split(".")[0] + ".csv"
            df.to_csv(save_file, index=False)
        user_output = f"All files are combined and saved as {save_file}"

    else:
        user_output = "Saving files cancelled"
    root.destroy()
    all_dataframes = pd.DataFrame()
    return user_output


eel.init("web")

try:
    eel.start("index.html", size=(1000, 600))
except Exception as e:
    if str(e) == "Can't find Google Chrome/Chromium installation":
        try:
            eel.start("index.html", mode="edge")
        except Exception as e:
            try:
                eel.start("index.html", mode="firefox")
            except Exception as e:
                root = Tk()
                root.geometry("100x200")
                root.wm_attributes("-topmost", 1)
                w = Label(root, text="No compatible browsers found!")
                w.pack()
                root.mainloop()
                time.sleep(2)
                root.destroy()
                exit()
