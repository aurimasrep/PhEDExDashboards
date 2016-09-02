#!/bin/sh
# Author: Aurimas Repecka <aurimas.repecka AT gmail [DOT] com>
# A wrapper script to remove phedex replica monitoring data from fs
# Parameters:
## $1 - output directory in fs
## $2 - number (in months) how long data should be kept (default should be: 3)

export KEYTAB=/data/arepecka.keytab
principal=`klist -k $KEYTAB | tail -1 | awk '{print $2}'`
kinit $principal -k -t $KEYTAB

filename=`date +%Y-%m-%d -d "${2} months ago"`

if [ -f $1/$filename ]; then
    rm $1/$filename
fi
