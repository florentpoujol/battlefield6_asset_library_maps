
/**
 * Script for the "mp_common_asset_library" map
 * Build by Florent Poujol
 * Sources: https://github.com/florentpoujol/battlefield6_asset_library_maps
 * Built on: Mon Oct 20 23:33:23     2025
 */

export class ObjectSpawner
{
    constructor(
        private _enum: any, // one of the mod.RuntimeSpawn_* enums, NOT one of its case, the whole enum
        private spawnObjectFunction: { (enumCase: any, position: mod.Vector, rotation: mod.Vector): mod.Object },
        private filters:  { (objectName: string): boolean }[] = [],
        private baseY: number = 0,
    ) {}

    public positionVectorsPerObjectName: {[index: string]: mod.Vector} = {}

    public spawnObjects(): void
    {
        const zeroVector = mod.CreateVector(0, 0, 0);

        const elements = Object.entries(this._enum);
        const elementsPerSide = Math.ceil(Math.sqrt(elements.length));
        const spacePerElement = 10;

        const max = Math.ceil((elementsPerSide / 2) * spacePerElement);
        let x = 0-max;
        let z = 0-max;
        let i = 0;

        for (const [name, value] of elements) {
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

            const position = mod.CreateVector(x, this.baseY, z);
            // const object = mod.SpawnObject(
            //     value,
            //     position,
            //     zeroVector
            // );
            const object = this.spawnObjectFunction(value, position, zeroVector);
            const positionStr = devTools.vectorToString(position);
            console.log('spawn object ' + i + ' ' + name + ' ' + mod.GetObjId(object) + ' ' + positionStr);

            this.positionVectorsPerObjectName[name] = position

            x += spacePerElement;
            if (x > max) { // start a new line
                x = 0-max;
                z += spacePerElement;
            }
            i++;
        }
    }
}

export class DevTools
{
    public log(message: string|mod.Message): void
    {
        const date = new Date();
        const timeElapsed = mod.GetMatchTimeElapsed().toFixed(3);

        console.log(
            `[${date.getMinutes()}m ${date.getSeconds()}s ${date.getMilliseconds()}ms] `,
            `[${timeElapsed}] `,
            message
        );
    }

    private loggedOnce: {[index: string]: boolean} = {};

    public logOnce(message: string): void
    {
        if (this.loggedOnce.hasOwnProperty(message)) {
            return;
        }

        this.loggedOnce[message] = true;

        this.log('[ONCE] ' + message);
    }

    public getRandomValueInArray<T>(array: Array<T>): T
    {
        return array[Math.floor(Math.random() * array.length)];
    }

    public vectorToString(vector: mod.Vector): string
    {
        return `(${mod.XComponentOf(vector)}, ${mod.YComponentOf(vector)}, ${mod.ZComponentOf(vector)})`
    }
}

export const devTools = new DevTools();

// import {devTools, ObjectSpawner} from "./common";

let objectSpawner: ObjectSpawner;
let rootUIWidget: mod.UIWidget|null = null;
let buttonTextWidget: mod.UIWidget|null = null;
let closeButtonWidget: mod.UIWidget|null = null;
let player: mod.Player|null = null;
let currentSfxName: string|null = null;

export function OnGameModeStarted(): void
{
    devTools.log("OnGameModeStarted");

    objectSpawner = new ObjectSpawner(
        mod.RuntimeSpawn_Common,
        (enumCase: mod.RuntimeSpawn_Common, position: mod.Vector, rotation: mod.Vector) => mod.SpawnObject(enumCase, position, rotation),
        [
            // these are gameplay objects
            (name: string) => name === 'AI_ActionStation',
            (name: string) => name === 'AI_Spawner',
            (name: string) => name === 'AI_WaypointPath',
            (name: string) => name === 'AreaTrigger',
            (name: string) => name === 'CapturePoint',
            (name: string) => name === 'CombatArea',
            (name: string) => name === 'DeployCam',
            (name: string) => name === 'HQ_PlayerSpawner',
            (name: string) => name === 'MCOM',
            (name: string) => name === 'PlayerSpawner',
            (name: string) => name === 'Sector',
            (name: string) => name === 'StationaryEmplacementSpawner',
            (name: string) => name === 'SurroundingCombatArea',
            (name: string) => name === 'VehicleSpawner',
            (name: string) => name === 'WorldIcon',
            (name: string) => name === 'LootSpawner',
            (name: string) => name.startsWith('Highway')
        ],
        135.5
    );

    objectSpawner.spawnObjects();

    UpdateLoop();
}

export function OnPlayerDeployed(eventPlayer: mod.Player): void
{
    player = eventPlayer;

    // mod.AddUIContainer(
    //     'rootUIWidget',
    //     mod.CreateVector(0, 0, 0),
    //     mod.CreateVector(200, 50, 0),
    //     mod.UIAnchor.TopCenter,
    //     mod.GetUIRoot(),
    //     true,
    //     5,
    //     mod.CreateVector(0.2, 0.2, 0.2),
    //     1,
    //     mod.UIBgFill.Solid,
    //     player
    // );
    mod.AddUIButton(
        'rootUIWidget',
        mod.CreateVector(0, 0, 0),
        mod.CreateVector(400, 50, 0),
        mod.UIAnchor.TopCenter,
        mod.GetUIRoot(),
        true,
        5,
        mod.CreateVector(0.2, 0.2, 0.2),
        1,
        mod.UIBgFill.Solid,
        true,
        // base
        mod.CreateVector(0, 0, 0),
        0,
        // disabled
        mod.CreateVector(0, 0, 0),
        0,
        // pressed
        mod.CreateVector(0.5, 0.5, 0.5),
        1,
        // hover
        mod.CreateVector(0.3, 0.3, 0.3),
        1,
        // focused
        mod.CreateVector(0, 0, 0),
        0,

        player,
    );
    rootUIWidget = mod.FindUIWidgetWithName('rootUIWidget');

    mod.AddUIButton(
        'close_button',
        mod.CreateVector(0, 0, 0),
        mod.CreateVector(30, 30, 0),
        mod.UIAnchor.TopRight,
        rootUIWidget as mod.UIWidget,
        true, // visible
        0,
        // bg
        mod.CreateVector(1, 0, 0),
        1,
        mod.UIBgFill.Solid,
        true,// enabled
        // base
        mod.CreateVector(1, 1, 0),
        0,
        // disabled
        mod.CreateVector(0, 0, 0),
        0,
        // pressed
        mod.CreateVector(0.8, 0, 0),
        1,
        // hover
        mod.CreateVector(1, 0, 0),
        1,
        // focused
        mod.CreateVector(1, 0, 0),
        0,

        player,
    );
    // closeButtonWidget = mod.FindUIWidgetWithName('close_button');

    mod.AddUIText(
        'object_name',
        mod.CreateVector(0, 0, 0),
        mod.CreateVector(380, 25, 0),
        mod.UIAnchor.Center,
        rootUIWidget as mod.UIWidget,
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
    buttonTextWidget = mod.FindUIWidgetWithName('object_name');
}

export function OnPlayerUndeploy(): void 
{
    if (player) {
        mod.EnableUIInputMode(false, player);
    }

    player = null;
    mod.DeleteAllUIWidgets();
    rootUIWidget = null;
    buttonTextWidget = null;
}
export function OnPlayerLeaveGame():void 
{
    OnPlayerUndeploy();
}

export async function UpdateLoop(): Promise<void>
{
    const worldIcon = mod.GetWorldIcon(1);
    mod.EnableWorldIconText(worldIcon, true);
    mod.EnableWorldIconImage(worldIcon, true);
    mod.SetWorldIconImage(worldIcon, mod.WorldIconImages.SquadPing);
    mod.SetWorldIconColor(worldIcon, mod.CreateVector(0.3, 0.3, 0.3)); // dark gray

    while (true) {
        await mod.Wait(1);

        if (!player) {
            continue;
        }

        let smallestDistance = 999.0;
        let closestObject: null|[string, mod.Vector] = null;

        const playerPosition = mod.GetSoldierState(player, mod.SoldierStateVector.GetPosition);
        for (const [name, objectPosition] of Object.entries(objectSpawner.positionVectorsPerObjectName)) {
            const distance = mod.DistanceBetween(playerPosition, objectPosition);
            if (distance < 30.0 && distance < smallestDistance) {
                smallestDistance = distance;
                closestObject = [name, objectPosition]; 
            }
        }

        let hideWidget = currentSfxName === null;
        if (closestObject !== null) {
            const [name, objectPosition] = closestObject;
            mod.SetWorldIconText(worldIcon, mod.Message(name));
            const iconPosition = mod.CreateVector(
                mod.XComponentOf(objectPosition),
                mod.YComponentOf(objectPosition) + 1,
                mod.ZComponentOf(objectPosition)
            );
            mod.SetWorldIconPosition(worldIcon, iconPosition);

            if (name.startsWith('SFX_') || name.startsWith('FX_')) {
                if (currentSfxName !== name) {
                    if (rootUIWidget) {
                        mod.SetUIWidgetVisible(rootUIWidget, true);
                    }
                    if (buttonTextWidget) {
                        mod.SetUITextLabel(buttonTextWidget, mod.Message('{}', name));
                    }
                    currentSfxName = name;
                    hideWidget = false;
                    console.log("show widget ", currentSfxName);
                }

                // if (mod.GetSoldierState(player, mod.SoldierStateBool.IsCrouching)) {
                //     mod.EnableUIInputMode(false, player);
                //     console.log('enable input mode');
                // }
            } else {
                hideWidget = true
            }
        }

        if (hideWidget) {
            console.log("hide widget");

            mod.EnableUIInputMode(false, player);
            if (rootUIWidget) {
                mod.SetUIWidgetVisible(rootUIWidget, false);
            }
            currentSfxName = null;
        }
    }
}

export function OnPlayerUIButtonEvent(player: mod.Player, widget: mod.UIWidget, buttonEvent: mod.UIButtonEvent): void
{
    if (buttonEvent !== mod.UIButtonEvent.ButtonUp) {
        return;
    }

    mod.EnableUIInputMode(false, player);

    const name = mod.GetUIWidgetName(widget);
    if (name === 'close_button') {
        console.log("close button clicked", currentSfxName);
        if (rootUIWidget) {
            mod.SetUIWidgetVisible(rootUIWidget, false);
        }

        return;
    }

    console.log("button clicked ", currentSfxName);
}
