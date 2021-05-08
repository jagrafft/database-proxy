import {existsSync, readFileSync, writeFileSync} from "fs";
import {homedir} from "os";
import {join} from "path";
import {exit} from "./errors";

const configFile = join(homedir(), ".observablehq");
const key = `database-proxy`;

function rawConfig() {
  if (!existsSync(configFile)) return null;
  return JSON.parse(readFileSync(configFile));
}

export function readConfig() {
  const config = rawConfig();
  return config && config[key];
}

export function readDecodedConfig(name) {
  const config = readConfig();
  // override Observable's type designation if custom type specified in ~/.observablehq entry
  if (name) {
    const raw = config && config[name];
    if (!raw) exit(`No configuration found for "${name}"`);
    
    let obj = {...decodeSecret(raw.secret), url: raw.url}

    if (obj.hasOwnProperty('type')) {
      obj.type = config[name].type
    }
        
    return obj
  } else {
    return Object.values(config).map(c => ({
      ...decodeSecret(c.secret),
      url: c.url
    }));
  }
}

export function writeConfig(proxyConfig) {
  const config = rawConfig() || {};
  config[key] = proxyConfig;
  writeFileSync(configFile, JSON.stringify(config, null, 2), {mode: 0o600});
}

export function decodeSecret(secret) {
  try {
    return JSON.parse(Buffer.from(secret, "base64"));
  } catch (error) {
    exit(error);
  }
}
