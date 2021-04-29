#!/usr/bin/ruby

def run_sequential_commands(commands)
  command = commands.join(' && ')
  system(command)
end

run_sequential_commands([
  'cd ../flic/bin/armv6l',

  # Recommended to stop any possible Bluetooth interference.
  # https://github.com/50ButtonsEach/fliclib-linux-hci#running
  'sudo service bluetooth stop',

  # Give flicd process access to the Bluetooh HCI channel
  # https://github.com/50ButtonsEach/fliclib-linux-hci#running
  'sudo setcap cap_net_admin=ep ./flicd',

  # Make sure the HCI process is started
  'systemctl status hciuart.service',

  './flicd -f flic.sqlite3',
])

run_sequential_commands([
  'cd flic/simpleclient/',
  'make',
  './simpleclient localhost',
])
