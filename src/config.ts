import { existsSync, readFileSync } from 'fs';
import fetch from 'cross-fetch';

export type RouterConfig = {
    mqttHost: string;
    mqttUsername: string;
    mqttPassword: string;
    dimmerHostname: string;
    envoyHostname: string;
    envoyToken: string;
} & LoadConfig;

export type LoadConfig = {
    loadPower: number;
    maxPower: number;
};

const fetchMqttConfigFromSupervisor = async (): Promise<Partial<RouterConfig>> => {
    const supervisorToken = process.env['SUPERVISOR_TOKEN'];
    if (!supervisorToken) {
        return {};
    }
 
    try {
        console.log('Fetching MQTT config from Supervisor...');
        const response = await fetch('http://supervisor/services/mqtt', {
            headers: {
                Authorization: `Bearer ${supervisorToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch MQTT config: ${response.statusText}`);
            return {};
        }

        const json = (await response.json()) as any;
        if (json.result === 'ok' && json.data) {
            console.log('Successfully fetched MQTT config from Supervisor');
            return {
                mqttHost: `${json.data.host}:${json.data.port}`,
                mqttUsername: json.data.username,
                mqttPassword: json.data.password,
            };
        }
    } catch (error) {
        console.error('Error fetching MQTT config from Supervisor:', error);
    }
    return {};
};

export const loadConfig = async (): Promise<RouterConfig> => {
    const optionsPath = '/data/options.json';
    let config: RouterConfig;

    if (existsSync(optionsPath)) {
        console.log(`Found config file at ${optionsPath}`);
        const options = JSON.parse(readFileSync(optionsPath, 'utf-8'));
        config = {
            mqttHost: options.mqtt_host,
            mqttUsername: options.mqtt_username,
            mqttPassword: options.mqtt_password,
            envoyHostname: options.envoy_hostname,
            envoyToken: options.envoy_token,
            dimmerHostname: options.dimmer_hostname,
            loadPower: options.load_power,
            maxPower: options.max_power,
        };
    } else {
        console.log(`Config file not found at ${optionsPath}, using environment variables`);
        config = {
            mqttHost: process.env['MQTT_HOST'] || '',
            mqttUsername: process.env['MQTT_USERNAME'] || '',
            mqttPassword: process.env['MQTT_PASSWORD'] || '',
            envoyHostname: process.env['ENVOY_HOSTNAME'] || '',
            envoyToken: process.env['TOKEN'] || '',
            dimmerHostname: process.env['DIMMER_HOSTNAME'] || '',
            loadPower: process.env['LOAD_POWER'] ? Number.parseInt(process.env['LOAD_POWER']) : 100,
            maxPower: process.env['MAX_PWR'] ? Number.parseInt(process.env['MAX_PWR']) : 50,
        };
    }

    if (!config.mqttHost || !config.mqttUsername || !config.mqttPassword) {
        const supervisorConfig = await fetchMqttConfigFromSupervisor();
        // Only override if we actually got something back
        if (supervisorConfig.mqttHost) {
            config.mqttHost = config.mqttHost || supervisorConfig.mqttHost;
            config.mqttUsername = config.mqttUsername || supervisorConfig.mqttUsername || '';
            config.mqttPassword = config.mqttPassword || supervisorConfig.mqttPassword || '';
        }
    }

    const configToLog = { ...config };
    if (configToLog.mqttPassword) configToLog.mqttPassword = '***';
    if (configToLog.envoyToken) configToLog.envoyToken = '***';

    console.log('Loaded config:', JSON.stringify(configToLog, null, 2));
    return config;
};
