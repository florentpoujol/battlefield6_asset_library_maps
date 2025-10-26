
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
        {
            ConstructionBuilding_FlagC_01: 101,
            ConstructionBuilding_FlagC_01_PropsA: 102,
            CliffLarge_03: 103,
            ConstructionBuilding_FlagD_01_PropsA: 104,
            ConstructionBuilding_FlagD_01: 105,
            PylonCollapsed_01: 106,
            Pylon_01_A: 107,
            Pylon_01_B: 108,
            CliffLarge_04: 109,
            CliffDarkLarge_03B: 110,
            MudRidgeHuge_Corner_01: 111,
            MudRidgeHuge_Straight_02: 112,
            MudRidgeHuge_Straight_03: 113,
            RidgeMud_01_B_C45: 114,
            CliffDarkLarge_01: 115,
            CliffDarkLarge_02A: 116,
            CliffDarkLarge_02B: 117,
            CliffRiverside_01: 118,
        },
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
