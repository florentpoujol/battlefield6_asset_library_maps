
export class ObjectSpawner
{
    constructor(
        private _enum: any, // one of the mod.RuntimeSpawn_* enums, NOT one of its case, the whole enum
        private spawnObjectFunction: { (enumCase: any, position: mod.Vector, rotation: mod.Vector): mod.Object },
        private filters:  { (objectName: string): boolean }[] = [],
        private baseY: number = 0,
    ) {}

    public positionVectorsPerObjectName: {[index: string]: mod.Vector} = {}

    public spawnObjects(): void
    {
        const zeroVector = mod.CreateVector(0, 0, 0);

        const elements = Object.entries(this._enum);
        const elementsPerSide = Math.ceil(Math.sqrt(elements.length));
        const spacePerElement = 10;

        const max = Math.ceil((elementsPerSide / 2) * spacePerElement);
        let x = 0-max;
        let z = 0-max;
        let i = 0;

        for (const [name, value] of elements) {
            let ignoreObject = false;
            for (const filter of this.filters) {
                if (filter(name)) {
                    ignoreObject = true;
                    break;
                }
            }
            if (ignoreObject) {
                continue;
            }

            const position = mod.CreateVector(x, this.baseY, z);
            // const object = mod.SpawnObject(
            //     value,
            //     position,
            //     zeroVector
            // );
            const object = this.spawnObjectFunction(value, position, zeroVector);
            const positionStr = devTools.vectorToString(position);
            console.log('spawn object ' + i + ' ' + name + ' ' + mod.GetObjId(object) + ' ' + positionStr);

            this.positionVectorsPerObjectName[name] = position

            x += spacePerElement;
            if (x > max) { // start a new line
                x = 0-max;
                z += spacePerElement;
            }
            i++;
        }
    }
}

export class DevTools
{
    public log(message: string|mod.Message): void
    {
        const date = new Date();
        const timeElapsed = mod.GetMatchTimeElapsed().toFixed(3);

        console.log(
            `[${date.getMinutes()}m ${date.getSeconds()}s ${date.getMilliseconds()}ms] `,
            `[${timeElapsed}] `,
            message
        );
    }

    private loggedOnce: {[index: string]: boolean} = {};

    public logOnce(message: string): void
    {
        if (this.loggedOnce.hasOwnProperty(message)) {
            return;
        }

        this.loggedOnce[message] = true;

        this.log('[ONCE] ' + message);
    }

    public getRandomValueInArray<T>(array: Array<T>): T
    {
        return array[Math.floor(Math.random() * array.length)];
    }

    public vectorToString(vector: mod.Vector): string
    {
        return `(${mod.XComponentOf(vector)}, ${mod.YComponentOf(vector)}, ${mod.ZComponentOf(vector)})`
    }
}

export const devTools = new DevTools();
