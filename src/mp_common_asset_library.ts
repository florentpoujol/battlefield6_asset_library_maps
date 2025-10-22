
import {ObjectSpawner} from "./common";

let objectSpawner: ObjectSpawner;
let player: mod.Player|undefined;

export async function OnGameModeStarted(): Promise<void>
{
    const gameplayObjects = [
        'AI_ActionStation',
        'AI_Spawner',
        'AI_WaypointPath',
        'AreaTrigger',
        'CapturePoint',
        'CombatArea',
        'DeployCam',
        'HQ_PlayerSpawner',
        'MCOM',
        'PlayerSpawner',
        'Sector',
        'StationaryEmplacementSpawner',
        'SurroundingCombatArea',
        'VehicleSpawner',
        'WorldIcon',
        'LootSpawner',
    ];

    objectSpawner = new ObjectSpawner(
        mod.RuntimeSpawn_Common,
        [
            (name: string) => gameplayObjects.includes(name),
            (name: string) => name.startsWith('Highway'),
            (name: string) => name.startsWith('SFX_') || name.startsWith('FX_'),
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
