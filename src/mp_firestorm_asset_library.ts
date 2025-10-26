
import {ObjectSpawner} from "./common";

let objectSpawner: ObjectSpawner;
let player: mod.Player|undefined;

export async function OnGameModeStarted(): Promise<void>
{
    objectSpawner = new ObjectSpawner(
        mod.RuntimeSpawn_FireStorm,
        [],
        250.3,
        10,
        [
            'GasTank_01', // 101
            'PressureTank_02',
            'CliffLarge_03',
            'CliffLarge_04',
            'CliffHuge_08B',
            'CliffHuge_08B_B',
            'CliffHuge_10_C90',
            'ConstructionSite_03_C',
            'ConstructionSite_04_B',
            'ConstructionSite_04_PropsA', // 110
            'ConstructionSite_04_PropsB',
            'ConstructionSite_04_PropsC',
            'RefineryConstruction_01',
            'RefineryBridge_01',
            'RefineryBridge_02',
            'FXSiloMedium_01',
            'FXSiloOilHuge_02',
            'SiloMedium_01',
            'SiloOilHuge_01',
            'SiloOilHuge_02', // 120
            'OilChimneyPlatform_02',
            'RefineryTowerPlatform_01_A',
            'RefineryTowerPlatform_01_B',
            'RefineryTowerPlatform_01_Beams',
            'Warehouse_01_A',
            'Warehouse_01_B',
            'Warehouse_01_C',
            'Warehouse_01_D',
            'ConstructionSite_02_B',
            'StorageShed_01', // 130
            'SiloOilHugeRoof_02',
            'Maze_02',
            'Maze_03',
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
