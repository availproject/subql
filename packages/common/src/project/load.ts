// Copyright 2020-2022 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {gte} from 'semver';
import {NETWORK_FAMILY, runnerMapping} from '../constants';
import {ProjectManifestV0_2_0} from '../project/versioned';
export function loadFromJsonOrYaml(file: string): unknown {
  const {ext} = path.parse(file);
  if (ext !== '.yaml' && ext !== '.yml' && ext !== '.json') {
    throw new Error(`Extension ${ext} not supported`);
  }
  const rawContent = fs.readFileSync(file, 'utf-8');
  return yaml.load(rawContent);
}

export function getManifestPath(manifestDir: string, filePath?: string): string {
  let manifestPath = manifestDir;
  if (fs.existsSync(manifestDir) && fs.lstatSync(manifestDir).isDirectory()) {
    const yamlFilePath = filePath ?? path.join(manifestDir, 'project.yaml');
    const jsonFilePath = filePath ?? path.join(manifestDir, 'project.json');
    if (fs.existsSync(yamlFilePath)) {
      manifestPath = yamlFilePath;
    } else if (fs.existsSync(jsonFilePath)) {
      manifestPath = jsonFilePath;
    } else {
      throw new Error(`Could not find project manifest under dir ${manifestDir}`);
    }
  }
  return manifestPath;
}

export function getSchemaPath(manifestDir: string, filePath?: string): string {
  const yamlFile = loadFromJsonOrYaml(getManifestPath(manifestDir, filePath));
  if ((yamlFile as any).specVersion === '0.0.1') {
    return path.join(manifestDir, (yamlFile as any).schema);
  }
  const project = yamlFile as ProjectManifestV0_2_0;
  if (!project.schema) {
    throw new Error(`Can't get schema in yaml file`);
  }
  if (!project.schema.file) {
    throw new Error(`schemaPath expect to be schema.file`);
  }
  return path.join(manifestDir, project.schema.file);
}

// Only work for manifest specVersion >= 1.0.0
export function getProjectNetwork(rawManifest: unknown): NETWORK_FAMILY {
  if (gte((rawManifest as any).specVersion, '1.0.0')) {
    const network = runnerMapping[(rawManifest as any).runner.node.name as keyof typeof runnerMapping];
    if (network === undefined) {
      throw new Error(`Can not identify project network with runner node ${(rawManifest as any).runner.node.name}`);
    }
    return network;
  } else {
    throw new Error('Can not identify project network under spec version 1.0.0');
  }
}
