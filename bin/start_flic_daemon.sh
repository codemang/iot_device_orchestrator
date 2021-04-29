#!/bin/bash

# https://stackoverflow.com/questions/59895/how-can-i-get-the-source-directory-of-a-bash-script-from-within-the-script-itsel
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
LOG_DIR=$SCRIPT_DIR/../log

mkdir -p $LOG_DIR

LOG_FILE=$LOG_DIR/flic.log

cd $SCRIPT_DIR/../flic/bin/armv6l

# Recommended to stop any possible Bluetooth interference.
# https://github.com/50ButtonsEach/fliclib-linux-hci#running
sudo service bluetooth stop >> $LOG_FILE

# Give flicd process access to the Bluetooh HCI channel
# https://github.com/50ButtonsEach/fliclib-linux-hci#running
sudo setcap cap_net_admin=ep ./flicd >> $LOG_FILE

# Make sure the HCI process is started
systemctl status hciuart.service >> $LOG_FILE

./flicd -f flic.sqlite3 -l $LOG_FILE
