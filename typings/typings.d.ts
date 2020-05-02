import {offsets} from "../src/game/offsets";

declare interface IProcessListEntry {
    cntThreads: number,
    szExeFile: string,
    th32ProcessID: number,
    th32ParentProcessID: number,
    pcPriClassBase: number,
}

declare interface IModuleListEntry {
    modBaseAddr: number;
    modBaseSize: number;
    szExePath: string;
    szModule: string;
    th32ProcessID: number;
    hModule: number;
}

declare interface IModuleObject {
    modBaseAddr: number;
    modBaseSize: number;
    szExePath: string;
    szModule: string;
    th32ModuleID: number;
}

declare interface IProcessObject {
    dwSize: number;
    th32ProcessID: number;
    cntThreads: number;
    th32ParentProcessID: number,
    pcPriClassBase: number;
    szExeFile: string;
    handle: number;
    modBaseAddr: number;
}

declare type EMemoryTypes = any;
declare type MemoryTypes =
    'byte'
    | 'int'
    | 'int32'
    | 'uint32'
    | 'int64'
    | 'uint64'
    | 'dword'
    | 'short'
    | 'long'
    | 'float'
    | 'double'
    | 'bool'
    | 'boolean'
    | 'ptr'
    | 'pointer'
    | 'str'
    | 'string'
    | 'vec3'
    | 'vector3'
    | 'vec4'
    | 'vector4';


/*
processObject =>
{ dwSize: 304,
  th32ProcessID: 16452,
  cntThreads: 3,
  th32ParentProcessID: 2412,
  pcPriClassBase: 8,
  szExeFile: 'notepad.exe',
  handle: 520,
  modBaseAddr: 3734306816 }
 */


// @ts-ignore
declare module 'memoryJs' {
    export function openProcess(processIdentifier: string, callback: (error: any, processObject: IProcessObject) => void): void;
    export function openProcess(processIdentifier: string): IProcessObject;

    export function getProcesses(callback: (error: any, processes: IProcessListEntry[]) => void): void;
    export function getProcesses(): IProcessListEntry[];

    export function findModule(moduleName: string, pid: string): IModuleListEntry;

    export function getModules(pid: string): IModuleObject[];

    export function readMemory(handle: number, address: any, dataType: EMemoryTypes);

    export function writeMemory(handle: number, address: any, value: any, dataType: EMemoryTypes);

    export function readBuffer(handle: number, address: any, size: number);

    export function writeBuffer(handle: number, address: any, buffer: any);
}

type Resolver<T> = {
    [Key in  keyof T]?: (type?: EMemoryTypes) => any;
    } & { base?: any; } & {
    set?: {
        [Key in  keyof T]?: (value: any, type?: EMemoryTypes) => void;
        }
};