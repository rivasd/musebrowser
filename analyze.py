
import argparse
import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
sns.set()

channel_names = ['TP9', 'AF7', 'AF8', 'TP10', 'AUX']

def parse_browser_df(df, name):

    df["t"] = pd.to_datetime(df["t"], unit="ms")
    df.set_index("t", inplace=True)
    df.rename(columns={"v":name}, inplace=True)
    return df


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Analyzer browser-obtained Muse EEG data")
    parser.add_argument('filepath', help="path to the data file")
    args = parser.parse_args()

    cols = []

    with open(args.filepath, "r") as rawfile:
        contents = json.load(rawfile)

        for electrode_name in contents:

            if electrode_name != "events":
                contents[electrode_name] = parse_browser_df(pd.DataFrame(contents[electrode_name]), electrode_name)
                
        
        eeg = pd.concat(contents, axis=1)
        pass
