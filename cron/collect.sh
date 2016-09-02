#!/bin/sh
# Author: Aurimas Repecka <aurimas.repecka AT gmail [DOT] com>
# A wrapper script to acquire phedex replica monitoring data from hdfs
# Parameters:
## $1 - source directory in hdfs (default should be /cms/phedex-monitoring)
## $2 - output directory in fs

now=$(date +'%Y-%m-%d')
filename=`date +%Y-%m-%d -d "yesterday"`
headers=now,br_user_group,data_tier,acquisition_era,node_kind,br_dest_bytes,br_node_bytes

hadoop fs -getmerge $1/$now* $2/$filename
sed -i '1s/^/'$headers'\n/' $2/$filename
