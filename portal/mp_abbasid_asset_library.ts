
/**
 * Script for the "mp_abbasid_asset_library" map
 * Build by Florent Poujol
 * Sources: https://github.com/florentpoujol/battlefield6_asset_library_maps
 * Built on: Wed Oct 22 23:09:15     2025
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
        private filters:  { (objectName: string): boolean }[] = [],
        private baseY: number = 0,
        private worldIconObjectId: number = 1
    ) {}

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
            mod.CreateVector(0, 10, 0), // position
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
        [
            (name: string) => name.startsWith('Mosque'),
            (name: string) => name.startsWith('OutskirtsHouse'),
            (name: string) => name.startsWith('Building_'),
            (name: string) => name.startsWith('Palace_'),
        ],
        135.5
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
}

export function OnPlayerUndeploy(): void
{
    player = undefined;
    objectSpawner.destroyUI();
}
