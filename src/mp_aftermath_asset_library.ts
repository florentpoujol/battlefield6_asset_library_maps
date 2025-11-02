
import {ObjectSpawner} from "./common";

let objectSpawner: ObjectSpawner;
let player: mod.Player|undefined;

export async function OnGameModeStarted(): Promise<void>
{
    objectSpawner = new ObjectSpawner(
        mod.RuntimeSpawn_Aftermath,
        [],
        190.5,
        1,
        [
            'MudRidgeHuge_Straight_01', // 101
            'BrickPileLarge_01',
            'BuildingVentLarge_01_A',
            'BuildingVentLarge_01_B',
            'BuildingVentLarge_01_C',
            'BuildingVentLarge_01_D',
            'BuildingVentLarge_01_D_Pale',
            'CliffDarkLarge_02A',
            'DirtPileLarge_02',
            'IvyJapaneseHydrangeaLargeWall_01', // 110
            'IvyJapaneseHydrangeaLargeWall_02',
            'IvyJapaneseHydrangeaLargeWall_03',
            'Panorama_01_LargeScaffolding',
            'RockLarge_06_A',
            'RockLarge_06_B',
            'RockpileLarge_01_A',
            'RockpileLarge_02',
            'RockpileLarge_03',
            'RuinHouseCorner_LargeDebris_01',
            'ServerRackLarge_01', // 120
            'TentLarge_01_FullOpen',
            'TrashPileLarge_01',
            // buildings
            'StatueOfLiberty_01',
            'Area06_Building_01_A',
            'Area06_Building_02_A',
            'Area06_Building_03_A',
            'Area06_Building_05_A',
            'Area07_Building_01',
            'Area07_Building_03_A',
            'Area07_Building_04', // 130
            'Area08_Building_01_A',
            'Area08_Building_02',
            'Area08_Building_05',
            'Area08_Building_06',
            'Area08_Building_07',
            'Area08_Building_07_PropsA',
            'Area08_Building_08',
            '', // 138 (forget)
            'Area08_Building_08_PropsA',
            'Area08_Building_09_PropsDressingA', // 140
            'Area08_Building_10_Destroyed',
            'Area08_Building_11',
            'Area10_Building_01_OOB',
            'Area10_Building_02_OOB',
            'Commercial_Modern_Building_03_B',
            'Commercial_Modern_Building_04_B',
            'FireStation_Building_01', // 147
            'PanoramaBuilding_01',
            'PanoramaBuilding_02',
            'Residential_BuildingModular_BG_01', // 150
            'Residential_BuildingModular_BackDrop_01',
            'RooftopBuilding_02',
            // manhattan bridge
            'BrooklynBridge_01_Under_Brigde',
            'BrooklynBridge_01_Under_Pedestrian',
            'BrooklynBridge_Base_B_Dmg_01',
            'BrooklynBridge_Base_B_Dmg_02',
            'BrooklynBridge_Base_B_Dmg_03',
            'BrooklynBridge_LightsOff_01',
            'HighwayOverpass_Bridge_01',
            'HighwayOverpass_Bridge_02', // 160
            'HighwayOverpass_Bridge_04',
            'HighwayOverpass_Bridge_BrokenBlockout_2',
            'ManhattanBridge_01_Anchorage_01',
            'ManhattanBridge_01_Cable_01',
            'ManhattanBridge_01_Cable_02',
            'ManhattanBridge_01_Cable_03',
            'ManhattanBridge_01_Cable_04',
            'ManhattanBridge_01_Cable_05',
            'ManhattanBridge_01_Cable_06',
            'ManhattanBridge_01_Cable_07', // 170
            'ManhattanBridge_01_Cable_08',
            'ManhattanBridge_01_Concrete',
            'ManhattanBridge_01_MetalBase_01',
            'ManhattanBridge_01_MetalConnect_01',
            'ManhattanBridge_01_MetalConnect_02',
            'ManhattanBridge_01_MetalConnect_03',
            'ManhattanBridge_01_Metal_01',
            'ManhattanBridge_01_Rope',
            'ManhattanBridge_01_Rope_01',
            'ManhattanBridge_01_Rope_02', // 180
            'ManhattanBridge_01_Rope_03',
            'ManhattanBridge_01_Rope_04',
            'ManhattanBridge_01_Rope_05',
            'ManhattanBridge_01_Rope_06',
            'ManhattanBridge_01_Stone', // 185
            // More large objects
            'HighwayBrooklyn_01_B',
            'ManhattanBridge_01_Streaming',
            'FoundationConstruction_01_1024x256',
            'FoundationConstruction_01_256x256',
            'FoundationConstruction_01_512x256', // 190
            'FoundationConstruction_01_C90',
            'FoundationPlanter_01_A',
            'FoundationPlanter_01_B',
            'FoundationPlanter_01_C',
            'FoundationPlanter_02_B',
            'FoundationPlanter_02_C',
            'FoundationPlanter_Long_01',
            'FoundationStairs_01_256x256_B',
            'FoundationWallTunnel_1024x768_01',
            'FoundationWallTunnel_512x512_01', // 200
            'FoundationWall_1024x256_01',
            'FoundationWall_1024x512_01',
            'FoundationWall_512x512_C90_01',
            'HighwayOverpass_Foundation_01'
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
