
import argparse
import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import re
import mne
import os.path
sns.set()

channel_names = ['TP9', 'AF7', 'AF8', 'TP10', 'AUX']

def copy_over(df, col_name):
    pass
    


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Analyze browser-obtained Muse EEG data")
    parser.add_argument('filepath', help="path to the data file")
    args = parser.parse_args()

    cols = {}
    mne_events = []

    # Specify a translation between event tags sent in your JS to numbers to be used within MNE
    codes = {"relax":1}

    raw_df = pd.read_csv(args.filepath)
    raw_df.loc[:,"timestamp"] = pd.to_datetime(raw_df.loc[:,"timestamp"], unit="ms")
    raw_df.set_index("timestamp", inplace=True)
    raw_df = pd.get_dummies(raw_df, columns=["electrode"], dtype=np.bool)

    for col in raw_df:
        if re.match(r'electrode_\d{1,2}$', col):
            cols[col] = (raw_df.loc[:,"value"][raw_df[col]].astype(np.float))

            

    clean_df = pd.concat(cols, axis=1)

    
    events = raw_df.loc[:,"value"][raw_df["electrode_event"]]
    for idx, row in events.iteritems():
        mne_events.append([clean_df.index.get_loc(idx, method="bfill"), 0, codes[row]])
    
    events = np.array(mne_events)
    info = mne.create_info(["TP9", "AF7", "AF8", "TP10"], 256, ["eeg", "eeg", "eeg", "eeg"])
    mne_muse =  mne.io.RawArray(clean_df.values.T / 1000000.0, info)
    mne_muse.save(os.path.join(os.path.splitext(os.path.basename(args.filepath)[0]), "_raw.fif"))

    pass

