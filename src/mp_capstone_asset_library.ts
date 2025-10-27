
import {ObjectSpawner} from "./common";

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
