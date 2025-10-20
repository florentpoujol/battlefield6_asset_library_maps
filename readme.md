# Battlefield 6 Asset Library maps

Since we can only see the general shape of assets in Godot, this projet contains teach maps 
with each assets specific to them laid out in a grid.

An icon in the 3D world show you the name of the closest asset.

When the asset is an SFX, or FX, then an interaction point allow you to trigger it.

## Build the strings.json file

Copy from the index.d.ts file the list of cases from one of the enum.  
Then do a search/replace with regex : search for `\w+(.+),`, and replace by `  "$1": "$1",` (works in Webstorm).