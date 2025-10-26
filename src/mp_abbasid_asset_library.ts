
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
        [
            'MosqueArches_01',
            'MosqueArches_01_B',
            'MosqueBase_01',
            'MosqueFront_01',
            'MosqueMinaret_01',
            'MosqueMinaret_01_B',
            'MosqueMinaret_01_C',
            'MosqueSmallDomes_01',
            'MosqueTop_01',
            'Mosque_01',
            'Palace_01',
            'Building_01',
            'Building_02',
            'Building_03',
            'BR_OutskirtsHouseMediumGround_01',
            'BR_OutskirtsHouseMediumIntermediate_01',
            'OutskirtsHouseMediumRoof_01',
            'OutskirtsHouseMedium_01_Props_D',
            'OutskirtsHouseMedium_03_Abbasid_Mirrored',
            'OutskirtsHouseMedium_03_Abbasid_Mirrored_BD',
            'OutskirtsHouseMedium_04_Abbasid_BD',
            'OutskirtsHouseMedium_04_Abbasid_Mirrored',
            'OutskirtsHouseMedium_04_Abbasid_Mirrored_BD',
            'OutskirtsHouseMedium_04_Abbasid_Mirrored_Props',
            'OutskirtsHouseMedium_05_Abbasid_Mirrored',
            'OutskirtsHouseMedium_05_Abbasid_Mirrored_Props',
            'OutskirtsHouseMedium_06_Abbasid_Mirrored_BD',
            'OutskirtsHouseMedium_07_Abbasid_BD',
            'HighwayOverpassProps_01',
            'BuildingBlockFloor_02',
            'BuildingBlockFloor_01',
            'BuildingBlockFloor_03',
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
