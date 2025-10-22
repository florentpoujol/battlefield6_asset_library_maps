#!/bin/bash

# execute from the root folder, not from 'tools'
# ie: ./tools/build.sh mp_abbasid_asset_library

if [[ -z "$1" ]]; then
  echo "ERROR: Expect the map name as first argument";
  exit;
fi

outputfilepath="./portal/$1.ts"

rm -f $outputfilepath
touch $outputfilepath

# put a watermark at the top
currentdate=$(date)
cat ./tools/concatenated-watermark.ts >> $outputfilepath 
sed -i "s/{mapname}/$1/g" $outputfilepath
sed -i "s/{date}/$currentdate/g" $outputfilepath

# concatenate scripts
cat ./src/common.ts >> $outputfilepath
cat "./src/$1.ts" >> $outputfilepath

sed -i 's/^import/\/\/ import/g' $outputfilepath 

# bring over the files from Godot
cp "G:\\bf6_portal\\export\\levels\\$1.spatial.json" "G:\\code\\bf6_asset_library_maps\\portal\\$1.spatial.json"
cp "G:\\bf6_portal\\GodotProject\\levels\\$1.tscn" "G:\\code\\bf6_asset_library_maps\\godot\\$1.tscn"
