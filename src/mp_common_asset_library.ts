
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
        [
            'HighwayOverpass_Bridge_01',
            'HighwayOverpass_Bridge_02',
            'HighwayOverpass_Bridge_04',
            'HighwayOverpass_Bridge_BrokenBlockout_2',
            'HighwayOverpass_CurveLong_01',
            'HighwayOverpass_Foundation_01',
            'HighwayOverpass_Straight_01_4096',
            'HighwaySplit_01',
            'HighwayStraight_01',
            'HighwayTurn_01',
            'FiringRange_WallPanelContact_01',
            'FiringRange_WallPanel_01',
            'FiringRange_Wall_1024_01',
            'FiringRange_Wall_2048_01',
            'FiringRange_Floor_01',
            'FiringRange_Floor_02',
            'FiringRange_Floor_A',
            'FiringRange_Floor_B',
            'FiringRange_Ceiling_01_A',
            'FiringRange_Ceiling_01_B',
            'FiringRange_Ceiling_01_C',
            'FiringRange_Ceiling_02',
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
