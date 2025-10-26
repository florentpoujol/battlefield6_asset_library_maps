
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
            (name: string) => name.startsWith('SFX_') || name.startsWith('FX_'),
        ],
        135.5,
        1,
        {
            HighwayOverpass_Bridge_01: 101,
            HighwayOverpass_Bridge_02: 102,
            HighwayOverpass_Bridge_04: 103,
            HighwayOverpass_Bridge_BrokenBlockout_2: 104,
            HighwayOverpass_CurveLong_01: 105,
            HighwayOverpass_Foundation_01: 106,
            HighwayOverpass_Straight_01_4096: 107,
            HighwaySplit_01: 108,
            HighwayStraight_01: 109,
            HighwayTurn_01: 110,
            FiringRange_WallPanelContact_01: 111,
            FiringRange_WallPanel_01: 112,
            FiringRange_Wall_1024_01: 113,
            FiringRange_Wall_2048_01: 114,
            FiringRange_Floor_01: 115,
            FiringRange_Floor_02: 116,
            FiringRange_Floor_A: 117,
            FiringRange_Floor_B: 118,
            FiringRange_Ceiling_01_A: 119,
            FiringRange_Ceiling_01_B: 120,
            FiringRange_Ceiling_01_C: 121,
            FiringRange_Ceiling_02: 122,
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
