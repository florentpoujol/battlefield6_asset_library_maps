
import {ObjectSpawner} from "./common";

let objectSpawner: ObjectSpawner;
let player: mod.Player|undefined;

export async function OnGameModeStarted(): Promise<void>
{
    objectSpawner = new ObjectSpawner(
        mod.RuntimeSpawn_Abbasid,
        [],
        150.5,
        1,
        {
            MosqueArches_01: 101,
            MosqueArches_01_B: 102,
            MosqueBase_01: 103,
            MosqueFront_01: 104,
            MosqueMinaret_01: 105,
            MosqueMinaret_01_B: 106,
            MosqueMinaret_01_C: 107,
            MosqueSmallDomes_01: 108,
            MosqueTop_01: 109,
            Mosque_01: 110,
            Palace_01: 111,
            Building_01: 112,
            Building_02: 113,
            Building_03: 114,
            BR_OutskirtsHouseMediumGround_01: 115,
            BR_OutskirtsHouseMediumIntermediate_01: 116,
            OutskirtsHouseMediumRoof_01: 117,
            OutskirtsHouseMedium_01_Props_D: 118,
            OutskirtsHouseMedium_03_Abbasid_Mirrored: 119,
            OutskirtsHouseMedium_03_Abbasid_Mirrored_BD: 120,
            OutskirtsHouseMedium_04_Abbasid_BD: 121,
            OutskirtsHouseMedium_04_Abbasid_Mirrored: 122,
            OutskirtsHouseMedium_04_Abbasid_Mirrored_BD: 123,
            OutskirtsHouseMedium_04_Abbasid_Mirrored_Props: 124,
            OutskirtsHouseMedium_05_Abbasid_Mirrored: 125,
            OutskirtsHouseMedium_05_Abbasid_Mirrored_Props: 126,
            OutskirtsHouseMedium_06_Abbasid_Mirrored_BD: 127,
            OutskirtsHouseMedium_07_Abbasid_BD: 128,
            HighwayOverpassProps_01: 129,
            BuildingBlockFloor_02: 130,
            BuildingBlockFloor_01: 131,
            BuildingBlockFloor_03: 132,
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
