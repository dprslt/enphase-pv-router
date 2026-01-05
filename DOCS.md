# Home Assistant Add-on: Enphase PV Router

## About

This add-on enables intelligent routing of excess solar PV power to resistive loads (such as a water heater) by bridging your Enphase Envoy Gateway with a WiFi PV Dimmer.

The router continuously monitors your solar production and grid consumption, automatically adjusting a connected dimmer to maximize self-consumption of your solar energy. It integrates seamlessly with Home Assistant through MQTT auto-discovery, providing real-time sensors for monitoring.

### Compatible Hardware

- **Enphase Envoy Gateway**: Required for reading solar production metrics
- **WiFi PV Dimmer**: This add-on was designed for the [Xlyric PV Dimmer](https://github.com/xlyric/PV-discharge-Dimmer-AC-Dimmer-KIT-Robotdyn)
  - [Documentation](https://pvrouteur.apper-solaire.org/)
  - [Forum Discussion (French)](https://forum-photovoltaique.fr/viewtopic.php?f=110&t=41777)

## Configuration

### Required Configuration

#### Envoy Hostname
The IP address or hostname of your Enphase Envoy Gateway (e.g., `192.168.1.90`).

#### Envoy Token
An authentication token for local API access to your Envoy Gateway.

**⚠️ IMPORTANT: This token expires after 1 year and must be renewed annually.**

To generate your token:
1. Visit: `https://enlighten.enphaseenergy.com/entrez-auth-token?serial_num=XXXXX`
2. Replace `XXXXX` with your Envoy's serial number
3. Log in with your Enphase account
4. Copy the generated Owner token

#### Dimmer Hostname
The IP address or hostname of your WiFi PV Dimmer (e.g., `192.168.1.75`).

#### Load Power
The power consumption of your resistive load in Watts (e.g., `1875` for a 1.875kW water heater).

Valid range: 1 to 10,000 Watts.

#### Max Power
Maximum power percentage for dimmer operation (0-100).

This limits how much power the dimmer can use. Set to `100` for full power capability, or lower to restrict maximum output.

Valid range: 1 to 100.

### MQTT Configuration

#### MQTT Host
The MQTT broker address with port.

**Default**: `core-mosquitto:1883` (Home Assistant's internal MQTT broker)

If you're using Home Assistant's Mosquitto add-on, you can leave this at the default. Otherwise, specify your MQTT broker address (e.g., `192.168.1.100:1883`).

#### MQTT Username (Optional)
Username for MQTT broker authentication. Leave empty if no authentication is required.

#### MQTT Password (Optional)
Password for MQTT broker authentication. Leave empty if no authentication is required.

## Installation

1. Access your Home Assistant addons folder via Samba share
2. Copy the entire repository to `/addons/enphase-pv-router/`
3. Restart Home Assistant or reload add-ons
4. Navigate to Settings → Add-ons → Add-on Store
5. Find "Enphase PV Router" in the local add-ons section
6. Click Install

See the repository README for detailed installation instructions.

## Home Assistant Integration

Once the add-on is running, it will automatically create sensors in Home Assistant via MQTT auto-discovery. You'll see:

- Solar production metrics
- Grid consumption data
- Dimmer status and power output
- Router state information

No manual configuration is needed - the sensors will appear automatically in your Home Assistant entities.

## Troubleshooting

### Add-on won't start
- Verify your Envoy token is valid and not expired
- Check that the Envoy hostname/IP is correct and reachable
- Ensure the dimmer hostname/IP is correct and reachable
- Verify MQTT broker is running and accessible

### No sensors appear in Home Assistant
- Check that MQTT integration is configured in Home Assistant
- Verify MQTT broker connection settings are correct
- Review add-on logs for connection errors

### Token Expiration
If you see authentication errors after ~1 year:
1. Generate a new token from Enphase (see Envoy Token configuration above)
2. Update the token in the add-on configuration
3. Restart the add-on

### Logs
Check the add-on logs for detailed startup information and any error messages. The logs will show:
- Configuration summary at startup
- Connection status to Envoy and Dimmer
- MQTT broker connection status
- Runtime operation details

## Support

For issues and questions:
- GitHub Issues: https://github.com/dprslt/enphase-pv-router/issues
- PV Forum (French): https://forum-photovoltaique.fr/

## More Information

More details about the project (in French): https://numerous-city-a34.notion.site/Autoconsommation-avanc-e-38a122da38d444749bfbb53cde584492
