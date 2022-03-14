from fileinput import filename
from tkinter.filedialog import askopenfilenames
import eel
from numpy import absolute
import pandas as pd
import os
import pathlib
from tkinter import Tk


# root.withdraw()
# file_path = filedialog.askopenfilename(parent=root)


# def lowAndStrip(text):
#     text = str(text)
#     text = text.strip()
#     text = " ".join(text.split())
#     return text


eel.init("web")
filenames = []


@eel.expose
def selectFiles():
    global filenames
    root = Tk()
    root.wm_attributes("-topmost", 1)
    root.wm_state("iconic")
    filenames = askopenfilenames(title="Open 'csv','xls', or 'xlsx' files", parent=root)
    root.destroy()
    all_columns = []
    for file in filenames:
        df = pd.read_csv(file, nrows=100)
        for x in df.columns:
            all_columns.append(x)
        all_columns = list(dict.fromkeys(all_columns))
        # print(df.columns)
        # all_columns += df.columns
    all_columns_and_file_names = (
        ":::".join([str(x) for x in all_columns])
        + "::::"
        + ",".join([x for x in filenames])
    )
    return all_columns_and_file_names


start = False


@eel.expose
def logColumnNames(column_name, column_names):
    # print(column_name, "|||", column_names)

    column_name = column_name.split(":::")
    column_names = column_names.split(":::")
    global wordlines
    wordlines = ""
    for nu, col in enumerate(column_name):
        wordlines += f"{col},{column_names[nu]}".strip(",") + ":::"
    # print(wordlines, "hee")
    # print(column_name, "|", column_names)
    file_directory = pathlib.Path(filenames[0]).parent.resolve()
    # Combiner
    wordlines = wordlines.strip(":::")

    final_columns = {}
    j = 0
    for line in wordlines.split(":::"):
        line = line.split(",")
        fin_col = []
        print(line, "h")
        for x in line:
            if x != "" and x != "\n":
                fin_col.append(x)
        if len(fin_col) == 1:
            final_columns[fin_col[0]] = fin_col
        else:
            final_columns[fin_col[0]] = fin_col[1:]
    big_df = pd.DataFrame(columns=final_columns.keys())
    # file_list2 = []
    absolute_path = os.path.join(file_directory, f"_chikku_combined.csv")
    for file in filenames:
        if file.endswith(".csv"):
            file_name = file.split(".")[0]
            df = pd.read_csv(file, low_memory=False)
            for k in final_columns:
                for v in final_columns[k]:
                    df.rename({v: k}, axis=1, inplace=True)
            for k_col in final_columns.keys():
                if k_col not in df.columns:
                    df[k_col] = ""
            df = df[final_columns.keys()]

            big_df = pd.concat([big_df, df])
            # file_list2.append(absolute_path)
            # print(f"Formating {file}")
            del df
    big_df.to_csv(absolute_path, index=False)
    print("Done Saving")

    # print("\nCombining the files\n***********")
    # combiner_list = []
    # for file in file_list2:
    #     if file.endswith(".csv"):
    #         print(f"Combining {file}")
    #         df = pd.read_csv(file, index_col=None, header=0, low_memory=False)
    #         combiner_list.append(df)
    # frame = pd.concat(combiner_list, axis=0, ignore_index=True)
    # absolute_path = os.path.join(file_directory, f"Combined.csv")
    # frame.to_csv(absolute_path, index=False)

    # for fi in os.listdir(file_directory):
    #     if fi.endswith("_chikku_combined.csv"):
    #         absolute_path = os.path.join(file_directory, f"{fi}")
    #         os.remove(absolute_path)

    # print("Done! combined and saved in Combined.csv")


eel.start("index.html", size=(1000, 600))
