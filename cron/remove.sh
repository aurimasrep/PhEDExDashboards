filename=`date +%Y-%m-%d -d "3 months ago"`
outputdir=/afs/cern.ch/user/a/arepecka/public/CrontabTest/out

if [ -f $outputdir/$filename ]; then
    rm $outputdir/$filename
fi
