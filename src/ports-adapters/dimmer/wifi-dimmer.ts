import { timeHttpGetJson, timeHttpGetText } from '../http.js';
import { Dimmer, DimmerValue } from './dimmer.js';

type WifiDimmerStatePayload = {
    dimmer: number;
    commande: number;
    temperature: string;
    power: number;
    Ptotal: number;
    relay1: boolean;
    relay2: number;
    minuteur: boolean;
    onoff: boolean;
    alerte: string;
    // TODO check thoses two types
    boost?: boolean;
    boost_endtime?: number;

    boost_max_temp: number;
    dallas0: string;
    addr0: string;
};

type WifiDimmerConfigPayload = {
    maxtemp: number;
    startingpow: number;
    minpow: number;
    maxpow: number;
    child: string;
    delester: string;
    SubscribePV: string;
    SubscribeTEMP: string;
    dimmer_on_off: boolean;
    charge: number;
    DALLAS: string;
    dimmername: string;
    charge1: number;
    charge2: number;
    charge3: number;
    trigger: number;
};

export class WifiDimmer implements Dimmer {
    constructor(private dimmerHostname: string) {}

    async readValues(): Promise<DimmerValue> {
        const dimmerState = await timeHttpGetJson<WifiDimmerStatePayload>(`http://${this.dimmerHostname}/state`);

        const dimmerConfig = await timeHttpGetJson<WifiDimmerConfigPayload>(`http://${this.dimmerHostname}/config`);

        return {
            // The dimmer send back two values now
            // command and dimmer, if we are not using a ZC, theses values are the same
            perc: dimmerState.dimmer || undefined,
            temp: dimmerState.temperature ? Number.parseInt(dimmerState.temperature) : undefined,
            isNotListening: dimmerState.minuteur || dimmerState.boost,
            maxTemp: dimmerConfig.maxtemp,
        };
    }

    async modulePower(power: number): Promise<void> {
        const cleanedPower = Math.floor(power);
        await timeHttpGetText(`http://${this.dimmerHostname}/?POWER=${cleanedPower}`);
    }
}
