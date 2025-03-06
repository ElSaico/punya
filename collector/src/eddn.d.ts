export type Power =
  | 'A. Lavigny-Duval'
  | 'Aisling Duval'
  | 'Archon Delaine'
  | 'Denton Patreus'
  | 'Edmund Mahon'
  | 'Felicia Winters'
  | 'Jerome Archer'
  | 'Li Yong-Rui'
  | 'Nakato Kaine'
  | 'Pranav Antal'
  | 'Yuri Grom'
  | 'Zemina Torval';

export type PowerState = 'Exploited' | 'Contested' | 'Fortified' | 'Stronghold';

export type SystemPosition = [number, number, number];

export interface FSSSignalDiscovered extends Message {
  event: 'FSSSignalDiscovered';
  signals: [
    {
      timestamp: string;
      SignalName: string;
      SignalType?: string;
      IsStation?: boolean;
      USSType?: string;
      SpawningState?: string;
      SpawningFaction?: string;
      SpawningPower?: string;
      OpposingPower?: string;
      ThreatLevel?: number;
    }
  ];
}

export interface FSDJump extends Message {
  event: 'FSDJump';
  Body: string;
  BodyID: number;
  BodyType: string;
  Population: number;
  Multicrew?: boolean;
  Taxi?: boolean;
  SystemAllegiance: string;
  SystemEconomy: string;
  SystemSecondEconomy: string;
  SystemGovernment: string;
  SystemSecurity: string;
  SystemFaction?: { FactionState?: string; Name: string };
  Conflicts?: never[];
  Factions?: never[];
  ControllingPower?: Power;
  PowerplayState?: PowerState;
  Powers?: string[];
}

export interface Message {
  event: string;
  horizons?: boolean;
  odyssey?: boolean;
  timestamp: string;
  SystemAddress: number;
  StarSystem: string;
  StarPos: SystemPosition;
}

export interface Journal {
  $schemaRef: string;
  header: {
    uploaderID: string;
    gameversion?: string;
    gamebuild?: string;
    softwareName: string;
    softwareVersion: string;
    gatewayTimestamp?: string;
  };
  message: Message;
}
