
/**
 * Script for the "mp_aftermath_asset_library" map
 * Build by Florent Poujol
 * Sources: https://github.com/florentpoujol/battlefield6_asset_library_maps
 * Built on: Sun Nov  2 10:56:45     2025
 */

export class SpawnedObject {
    constructor(
        public readonly name: string,
        public readonly position: mod.Vector,
    ) {}
}

export class ObjectSpawner
{
    constructor(
        private _enum: any, // one of the mod.RuntimeSpawn_* enums, NOT one of its case, the whole enum
        private ignoreFilters:  { (objectName: string): boolean }[],
        private baseY: number,
        private worldIconObjectId: number,
        private largeObjectNames: string[],
        private largeObjectStartId = 101,
    ) {
        // automatically exclude objets referenced as large object
        const largeObjects = this.largeObjectNames;
        this.ignoreFilters.push((name: string): boolean => largeObjects.includes(name));

        this.worldIcon = mod.GetWorldIcon(this.worldIconObjectId); // unlikely to work now but this is to satisfy TS compiler
    }

    private objects: {[index: string]: SpawnedObject} = {}

    public spawnObjects(): void
    {
        const zeroVector = mod.CreateVector(0, 0, 0);

        const initialElements = Object.entries(this._enum);
        const objectNamesToSpawn: string[] = [];
        for (const [name, value] of initialElements) {
            let ignoreObject = false;
            for (const filter of this.ignoreFilters) {
                if (filter(name)) {
                    ignoreObject = true;
                    break;
                }
            }
            if (ignoreObject) {
                continue;
            }

            objectNamesToSpawn.push(name);
        }

        const elementsPerSide = Math.ceil(Math.sqrt(objectNamesToSpawn.length));
        const spacePerElement = 10;

        const max = Math.ceil((elementsPerSide / 2) * spacePerElement);
        let x = 0-max;
        let z = 0-max;
        let i = 0;

        for (const name of objectNamesToSpawn) {
            const position = mod.CreateVector(x, this.baseY, z);

            mod.SpawnObject(
                this._enum[name] as any,
                position,
                zeroVector
            );

            this.objects[name] = new SpawnedObject(name, position);

            x += spacePerElement;
            if (x > max) { // start a new line
                x = 0-max;
                z += spacePerElement;
            }
            i++;
        }

        let largeObjectId = this.largeObjectStartId;
        for (let i = 0; i < this.largeObjectNames.length; i++) {
            const object = mod.GetSpatialObject(largeObjectId);
            largeObjectId++;
            if (object != undefined) {
                const position = mod.GetObjectPosition(object);
                const name = this.largeObjectNames[i];
                this.objects[name] = new SpawnedObject(name, position);
            }
        }
    }

    private findClosestObjectFromPlayer(player: mod.Player): null|SpawnedObject
    {
        let smallestDistance = 999.0;
        let closestObject: null|SpawnedObject = null;

        const playerPosition = mod.GetSoldierState(player, mod.SoldierStateVector.GetPosition);

        for (const spawnedObject of Object.values(this.objects)) {
            const distance = mod.DistanceBetween(playerPosition, spawnedObject.position);
            if (distance < 50.0 && distance < smallestDistance) {
                smallestDistance = distance;
                closestObject = spawnedObject;
            }
        }

        return closestObject
    }

    private rootUIWidget: mod.UIWidget|undefined;
    private objectNameUIWidget: mod.UIWidget|undefined;
    private worldIcon: mod.WorldIcon;

    public createUI(player: mod.Player): void
    {
        mod.AddUIContainer(
            'rootUIWidget',
            mod.CreateVector(0, 10, 0), // position (positiv Y = toward the top)
            mod.CreateVector(600, 50, 0), // size
            mod.UIAnchor.BottomCenter,
            mod.GetUIRoot(),
            true,
            5,
            mod.CreateVector(0.2, 0.2, 0.2),
            0.8,
            mod.UIBgFill.Solid,
            player
        );
        this.rootUIWidget = mod.FindUIWidgetWithName('rootUIWidget') as mod.UIWidget;

        mod.AddUIText(
            'object_name',
            mod.CreateVector(0, 0, 0),
            mod.CreateVector(600, 40, 0),
            mod.UIAnchor.Center,
            this.rootUIWidget as mod.UIWidget,
            true,
            5,
            // background
            mod.CreateVector(0, 0, 0),
            0,
            mod.UIBgFill.None,
            // text message, size, color, alpha, anchor
            mod.Message(''), // will be replaced when needed
            25,
            mod.CreateVector(1, 1, 1),
            1,
            mod.UIAnchor.Center,
        );
        this.objectNameUIWidget = mod.FindUIWidgetWithName('object_name') as mod.UIWidget;

        this.worldIcon = mod.GetWorldIcon(this.worldIconObjectId);
        mod.EnableWorldIconText(this.worldIcon, true);
        mod.EnableWorldIconImage(this.worldIcon, true);
        mod.SetWorldIconImage(this.worldIcon, mod.WorldIconImages.SquadPing);
        mod.SetWorldIconColor(this.worldIcon, mod.CreateVector(1, 0, 0));
    }

    public destroyUI(): void
    {
        mod.DeleteAllUIWidgets();
        this.rootUIWidget = undefined;
        this.objectNameUIWidget = undefined;
    }

    public OnUpdate(player: mod.Player): void
    {
        const closestObject: null|SpawnedObject = this.findClosestObjectFromPlayer(player);
        if (closestObject === null) {
            return;
        }

        const name = mod.Message(closestObject.name);

        if (this.objectNameUIWidget) {
            mod.SetUITextLabel(this.objectNameUIWidget, name);
        }

        mod.SetWorldIconText(this.worldIcon, name);
        mod.SetWorldIconPosition(this.worldIcon, mod.CreateVector(
            mod.XComponentOf(closestObject.position),
            mod.YComponentOf(closestObject.position) + 1,
            mod.ZComponentOf(closestObject.position)
        ));
    }
}

// import {ObjectSpawner} from "./common";

let objectSpawner: ObjectSpawner;
let player: mod.Player|undefined;

export async function OnGameModeStarted(): Promise<void>
{
    objectSpawner = new ObjectSpawner(
        mod.RuntimeSpawn_Aftermath,
        [],
        190.5,
        1,
        [
            'MudRidgeHuge_Straight_01', // 101
            'BrickPileLarge_01',
            'BuildingVentLarge_01_A',
            'BuildingVentLarge_01_B',
            'BuildingVentLarge_01_C',
            'BuildingVentLarge_01_D',
            'BuildingVentLarge_01_D_Pale',
            'CliffDarkLarge_02A',
            'DirtPileLarge_02',
            'IvyJapaneseHydrangeaLargeWall_01', // 110
            'IvyJapaneseHydrangeaLargeWall_02',
            'IvyJapaneseHydrangeaLargeWall_03',
            'Panorama_01_LargeScaffolding',
            'RockLarge_06_A',
            'RockLarge_06_B',
            'RockpileLarge_01_A',
            'RockpileLarge_02',
            'RockpileLarge_03',
            'RuinHouseCorner_LargeDebris_01',
            'ServerRackLarge_01', // 120
            'TentLarge_01_FullOpen',
            'TrashPileLarge_01',
            // buildings
            'StatueOfLiberty_01',
            'Area06_Building_01_A',
            'Area06_Building_02_A',
            'Area06_Building_03_A',
            'Area06_Building_05_A',
            'Area07_Building_01',
            'Area07_Building_03_A',
            'Area07_Building_04', // 130
            'Area08_Building_01_A',
            'Area08_Building_02',
            'Area08_Building_05',
            'Area08_Building_06',
            'Area08_Building_07',
            'Area08_Building_07_PropsA',
            'Area08_Building_08',
            '', // 138 (forget)
            'Area08_Building_08_PropsA',
            'Area08_Building_09_PropsDressingA', // 140
            'Area08_Building_10_Destroyed',
            'Area08_Building_11',
            'Area10_Building_01_OOB',
            'Area10_Building_02_OOB',
            'Commercial_Modern_Building_03_B',
            'Commercial_Modern_Building_04_B',
            'FireStation_Building_01', // 147
            'PanoramaBuilding_01',
            'PanoramaBuilding_02',
            'Residential_BuildingModular_BG_01', // 150
            'Residential_BuildingModular_BackDrop_01',
            'RooftopBuilding_02',
            // manhattan bridge
            'BrooklynBridge_01_Under_Brigde',
            'BrooklynBridge_01_Under_Pedestrian',
            'BrooklynBridge_Base_B_Dmg_01',
            'BrooklynBridge_Base_B_Dmg_02',
            'BrooklynBridge_Base_B_Dmg_03',
            'BrooklynBridge_LightsOff_01',
            'HighwayOverpass_Bridge_01',
            'HighwayOverpass_Bridge_02', // 160
            'HighwayOverpass_Bridge_04',
            'HighwayOverpass_Bridge_BrokenBlockout_2',
            'ManhattanBridge_01_Anchorage_01',
            'ManhattanBridge_01_Cable_01',
            'ManhattanBridge_01_Cable_02',
            'ManhattanBridge_01_Cable_03',
            'ManhattanBridge_01_Cable_04',
            'ManhattanBridge_01_Cable_05',
            'ManhattanBridge_01_Cable_06',
            'ManhattanBridge_01_Cable_07', // 170
            'ManhattanBridge_01_Cable_08',
            'ManhattanBridge_01_Concrete',
            'ManhattanBridge_01_MetalBase_01',
            'ManhattanBridge_01_MetalConnect_01',
            'ManhattanBridge_01_MetalConnect_02',
            'ManhattanBridge_01_MetalConnect_03',
            'ManhattanBridge_01_Metal_01',
            'ManhattanBridge_01_Rope',
            'ManhattanBridge_01_Rope_01',
            'ManhattanBridge_01_Rope_02', // 180
            'ManhattanBridge_01_Rope_03',
            'ManhattanBridge_01_Rope_04',
            'ManhattanBridge_01_Rope_05',
            'ManhattanBridge_01_Rope_06',
            'ManhattanBridge_01_Stone', // 185
            // More large objects
            'HighwayBrooklyn_01_B',
            'ManhattanBridge_01_Streaming',
            'FoundationConstruction_01_1024x256',
            'FoundationConstruction_01_256x256',
            'FoundationConstruction_01_512x256', // 190
            'FoundationConstruction_01_C90',
            'FoundationPlanter_01_A',
            'FoundationPlanter_01_B',
            'FoundationPlanter_01_C',
            'FoundationPlanter_02_B',
            'FoundationPlanter_02_C',
            'FoundationPlanter_Long_01',
            'FoundationStairs_01_256x256_B',
            'FoundationWallTunnel_1024x768_01',
            'FoundationWallTunnel_512x512_01', // 200
            'FoundationWall_1024x256_01',
            'FoundationWall_1024x512_01',
            'FoundationWall_512x512_C90_01',
            'HighwayOverpass_Foundation_01'
        ],
        101
    );

    objectSpawner.spawnObjects();

    while (true) {
        await mod.Wait(1);

        if (!player) {
            await mod.Wait(5);
            continue;
        }

        objectSpawner.OnUpdate(player);
    }
}

export function OnPlayerDeployed(eventPlayer: mod.Player): void
{
    player = eventPlayer;
    objectSpawner.createUI(eventPlayer);
    mod.SetPlayerMovementSpeedMultiplier(player, 2);
}

export function OnPlayerUndeploy(): void
{
    player = undefined;
    objectSpawner.destroyUI();
}
