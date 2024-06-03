#!/bin/bash

sudo apt-get update
sudo apt-get install -y software-properties-common

sudo add-apt-repository -y ppa:ubuntu-toolchain-r/test
sudo apt-get update

sudo apt-get install -y wkhtmltopdf

wkhtmltopdf --version