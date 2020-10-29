import * as memoryJs from 'memoryJs';
import {
  IModuleListEntry, IModuleObject, IProcessObject,
} from 'memoryJs';
import { MemoryTypes } from './process.interfaces';

export class ProcessService implements IProcessObject {
    dwSize: number;

    th32ProcessID: number;

    cntThreads: number;

    th32ParentProcessID: number;

    pcPriClassBase: number;

    szExeFile: string;

    handle: number;

    modBaseAddr: number;

    modules: { [index: string]: IModuleListEntry } = {};

    constructor(exeName: string) {
      this.copyInstanceToClass(memoryJs.openProcess(exeName));
      this.getAllModules();
    }

    getModule(moduleName): IModuleListEntry {
      if (!this.modules[moduleName]) {
        this.modules[moduleName] = memoryJs.findModule(moduleName, this.th32ProcessID);
      }
      return this.modules[moduleName];
    }

    readMemory(addr: any, type: MemoryTypes) {
      return memoryJs.readMemory(this.handle, addr, type);
    }

    readMatrix(addr: any, type: MemoryTypes) {
      return memoryJs.readMemory(this.handle, addr, type);
    }

    writeMemory(addr: any, value, type: MemoryTypes, handle?: IModuleListEntry) {
      return memoryJs.writeMemory(this.handle, addr, value, type);
    }

    readBuffer(addr: any, size: number, handle?: IModuleListEntry) {
      return memoryJs.readBuffer(handle ? handle.hModule : this.handle, addr, size);
    }

    writeBuffer(addr: any, buffer: number, handle?: IModuleListEntry) {
      return memoryJs.writeBuffer(handle ? handle.hModule : this.handle, addr, buffer);
    }

    private copyInstanceToClass(inst: IProcessObject) {
      for (const key in inst) {
        this[key] = inst[key];
      }
    }

    private getAllModules(): IModuleObject {
      memoryJs.getModules(this.th32ProcessID).map((m) => {
        if (m.szModule) {
          this.getModule(m.szModule);
        }
      });
    }
}
