from fileinput import filename
from tkinter.filedialog import asksaveasfilename
from tkinter.filedialog import askopenfilenames
import eel
from numpy import absolute
import pandas as pd
import os
import pathlib
import numpy
from tkinter import Tk


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
    for file in file_names:
        df = readDfCols(file)
        for x in df.columns:
            all_columns.append(x)
    all_columns = list(dict.fromkeys(all_columns))
    files_and_columns = [file_names, all_columns]
    return files_and_columns


all_dataframes = pd.DataFrame()


@eel.expose
def receiveInputs(file_name, headers_input, column_names):
    print("Done Combining")
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
    try:
        savefile = asksaveasfilename(filetypes=[("All files", "*.*")])
        print(savefile)
        if savefile.endswith(".xlsx"):
            df.to_excel(savefile, index=False)
        elif savefile.endswith(".xls"):
            df.to_excel(savefile, index=False)
        elif savefile.endswith(".tsv"):
            df.to_csv(savefile, index=False)
        elif savefile.endswith(".csv"):
            df.to_csv(savefile, index=False)
        else:
            df.to_csv(savefile.split(".")[0] + ".csv", index=False)
        user_output = f"All files are combined and saved as {savefile}"

    except AttributeError:
        user_output = "User canceled"
        print("The user cancelled save")
    root.destroy()
    all_dataframes = pd.DataFrame()
    return user_output


eel.init("web")


eel.start("index.html", size=(1000, 600))
