export type DimmerValue = {
    perc?: number;
    temp?: number;
    isNotListening?: boolean;
    maxTemp?: number;
};

export interface Dimmer {
    readValues(): Promise<DimmerValue>;
    modulePower(power: number): Promise<void>;
}
