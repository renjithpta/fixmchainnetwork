#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This script brings up a Hyperledger Fabric network for testing smart contracts
# and applications. The test network consists of two organizations with one
# peer each, and a single node Raft ordering service. Users can also use this
# script to create a channel deploy a chaincode on the channel
#
# prepending $PWD/../bin to PATH to ensure we are picking up the correct binaries
# this may be commented out to resolve installed version of tools if desired
./network.sh down
docker system prune -y
./network.sh up -ca
sleep 3
echo "=======creating channel============"
./network.sh createChannel
sleep 3
./network.sh deployCC -ccn fixmtoacriscontract_1.0 -ccp ../chaincode -ccl typescript


