import { ContainerModule } from "inversify";
import { itabashiAutoPostGasDependencies } from "./itabashi-auto-post-gas";
import { settingACLDependencies } from "./setting";
import { xACLDependencies } from "./x";

export const aclDependencies: Array<ContainerModule> = [
  ...itabashiAutoPostGasDependencies,
  ...settingACLDependencies,
  ...xACLDependencies,
];
