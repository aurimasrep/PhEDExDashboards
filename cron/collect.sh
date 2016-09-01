now=$(date +'%Y-%m-%d')
filename=`date +%Y-%m-%d -d "yesterday"`
sourcedir=/cms/phedex-monitoring
outputdir=/afs/cern.ch/user/a/arepecka/public/CrontabTest/out
headers=now,br_user_group,data_tier,acquisition_era,node_kind,br_dest_bytes,br_node_bytes

hadoop fs -getmerge $sourcedir/$now* $outputdir/$filename
sed -i '1s/^/'$headers'\n/' $outputdir/$filename
