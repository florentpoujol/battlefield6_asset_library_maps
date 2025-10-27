
/**
 * Script for the "mp_capstone_asset_library" map
 * Build by Florent Poujol
 * Sources: https://github.com/florentpoujol/battlefield6_asset_library_maps
 * Built on: Mon Oct 27 21:31:35     2025
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
        this.ignoreFilters.push((name: string): boolean => largeObjects.includes(name))
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
    /** @ts-ignore */
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
        mod.RuntimeSpawn_Capstone,
        [],
        250.3,
        10,
        [
            'CliffHuge_02', // 101
            'CliffHuge_08A',
            'CliffHuge_08B_B',
            'CliffHuge_10',
            'CliffHuge_10_C90',
            'CliffHuge_20',
            'CliffHuge_20_C45',
            'CliffHuge_20_C90',
            'CliffHuge_20_CliffPoint_A',
            'CliffHuge_20_CliffPoint_B', // 110
            'CliffLarge_03',
            'CliffLarge_04',
            'Pylon_01_A',
            'Pylon_01_B',
            '', // deleted
            '', // deleted
            '', // deleted
            'RockLarge_06_A',
            'RockLarge_06_B',
            'HouseRuralLarge_01_Mirror_PropsA', // 120
            'HouseRuralLarge_01_Mirror_PropsB',
            'HouseRuralLarge_01_Mirrored',
            'HouseRuralO02',
            'HouseRuralO02_PropsB',
            'HouseRuralO02_PropsC',
            'HouseRuralSmall_01_A',
            'HouseRuralSmall_01_A_Mirror_PropsA',
            'HouseRuralSmall_01_A_PropsA',
            'HouseRuralSmall_01_A_PropsC',
            'HouseRuralSmall_01_A_PropsD', // 130
            'HouseRuralSmall_01_B',
            'HouseRuralSmall_01_B_Mirror_PropsA',
            'HouseRuralSmall_01_B_Mirror_PropsB',
            'HouseRuralSmall_01_B_PropsA',
            'HouseRuralSmall_01_B_PropsB',
            'HouseRuralSmall_01_B_PropsD',
            'HouseRuralSmall_01_B_PropsE',
            'HouseRuralSmall_01_Mirrored_B',
            'HouseRural_01_A',
            'HouseRural_01_B', // 140
            'HouseRural_01_C',
            'HouseRural_01_D',
            'HouseRural_01_E',
            'HouseRural_01_F',
            'HouseRural_01_G',
            'HouseRural_01_H',
            'HouseRural_01_I',
            'HouseRural_01_J',
            'HouseRuralSmall_02',
            'HouseRuralSmall_02_A_PropsA', // 150
            'HouseRuralSmall_02_A_PropsB',
            'HescoTower_01',
            'HescoTower_01_Beige',
            'Hescoline_01',
            'Hescoline_02',
            'Guard_Tower',

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
