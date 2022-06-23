Bluetooth Button Light Orchestration
=

## Overview
This repo contains a framework for controlling a series of IOT devices via a
Bluetooth button. In my case, I've programmed a series of lights and speakers in
my room to respond to 3 unique types of button clicks on my [Flic
button](https://flic.io/shop/flic-2-single-pack).

## Architecture
While I wanted to be able to control my lights and speakers via a Bluetooth
button, I knew I also wanted to be able to do so from the command line, as well
as through a mobile app. For that reason, the architecture for this application
looks like the following:
