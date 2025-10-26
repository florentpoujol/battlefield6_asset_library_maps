
/**
 * Script for the "mp_abbasid_asset_library" map
 * Build by Florent Poujol
 * Sources: https://github.com/florentpoujol/battlefield6_asset_library_maps
 * Built on: Sun Oct 26 12:31:40     2025
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
        private filters:  { (objectName: string): boolean }[],
        private baseY: number,
        private worldIconObjectId: number,
        private largeObjectIdsPerName: { [index:string]: number },
    ) {
        // automatically exclude objets referenced as large object
        const largeObjects = Object.keys(this.largeObjectIdsPerName);
        this.filters.push((name: string): boolean => largeObjects.includes(name))
    }

    private objects: {[index: string]: SpawnedObject} = {}

    public spawnObjects(): void
    {
        const zeroVector = mod.CreateVector(0, 0, 0);

        const initialElements = Object.entries(this._enum);
        const objectNamesToSpawn: string[] = [];
        for (const [name, value] of initialElements) {
            let ignoreObject = false;
            for (const filter of this.filters) {
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

        for (const [name, id] of Object.entries(this.largeObjectIdsPerName)) {
            const object = mod.GetSpatialObject(id);
            if (object != undefined) {
                const position = mod.GetObjectPosition(object);
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
            if (distance < 30.0 && distance < smallestDistance) {
                smallestDistance = distance;
                closestObject = spawnedObject;
            }
        }

        return closestObject
    }

    private rootUIWidget: mod.UIWidget|undefined;
    private objectNameUIWidget: mod.UIWidget|undefined;
    /** @ts-ignore */
    private worldIcon: mod.WorldIcon;

    public createUI(player: mod.Player): void
    {
        mod.AddUIContainer(
            'rootUIWidget',
            mod.CreateVector(0, 10, 0), // position (positiv Y = toward the top)
            mod.CreateVector(500, 50, 0), // size
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
            mod.CreateVector(380, 40, 0),
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
        mod.RuntimeSpawn_Abbasid,
        [],
        150.5,
        1,
        {
            MosqueArches_01: 101,
            MosqueArches_01_B: 102,
            MosqueBase_01: 103,
            MosqueFront_01: 104,
            MosqueMinaret_01: 105,
            MosqueMinaret_01_B: 106,
            MosqueMinaret_01_C: 107,
            MosqueSmallDomes_01: 108,
            MosqueTop_01: 109,
            Mosque_01: 110,
            Palace_01: 111,
            Building_01: 112,
            Building_02: 113,
            Building_03: 114,
            BR_OutskirtsHouseMediumGround_01: 115,
            BR_OutskirtsHouseMediumIntermediate_01: 116,
            OutskirtsHouseMediumRoof_01: 117,
            OutskirtsHouseMedium_01_Props_D: 118,
            OutskirtsHouseMedium_03_Abbasid_Mirrored: 119,
            OutskirtsHouseMedium_03_Abbasid_Mirrored_BD: 120,
            OutskirtsHouseMedium_04_Abbasid_BD: 121,
            OutskirtsHouseMedium_04_Abbasid_Mirrored: 122,
            OutskirtsHouseMedium_04_Abbasid_Mirrored_BD: 123,
            OutskirtsHouseMedium_04_Abbasid_Mirrored_Props: 124,
            OutskirtsHouseMedium_05_Abbasid_Mirrored: 125,
            OutskirtsHouseMedium_05_Abbasid_Mirrored_Props: 126,
            OutskirtsHouseMedium_06_Abbasid_Mirrored_BD: 127,
            OutskirtsHouseMedium_07_Abbasid_BD: 128,
            HighwayOverpassProps_01: 129,
            BuildingBlockFloor_02: 130,
            BuildingBlockFloor_01: 131,
            BuildingBlockFloor_03: 132,
        }
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
