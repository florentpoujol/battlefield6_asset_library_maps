
import {ObjectSpawner} from "./common";

let objectSpawner: ObjectSpawner;
let player: mod.Player|undefined;

export async function OnGameModeStarted(): Promise<void>
{
    objectSpawner = new ObjectSpawner(
        mod.RuntimeSpawn_Tungsten,
        [
        ],
        155.5,
        1,
        [
            'ConstructionBuilding_FlagC_01',
            'ConstructionBuilding_FlagC_01_PropsA',
            'CliffLarge_03',
            'ConstructionBuilding_FlagD_01_PropsA',
            'ConstructionBuilding_FlagD_01',
            'PylonCollapsed_01',
            'Pylon_01_A',
            'Pylon_01_B',
            'CliffLarge_04',
            'CliffDarkLarge_03B',
            'MudRidgeHuge_Corner_01',
            'MudRidgeHuge_Straight_02',
            'MudRidgeHuge_Straight_03',
            'RidgeMud_01_B_C45',
            'CliffDarkLarge_01',
            'CliffDarkLarge_02A',
            'CliffDarkLarge_02B',
            'CliffRiverside_01',
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
