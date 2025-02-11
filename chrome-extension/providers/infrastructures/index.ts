import { ContainerModule } from "inversify";
import { authentication } from "./authentication";
import { message } from "./message";
import { notification } from "./notification";

export const infrastructureDependencies: Array<ContainerModule> = [
  authentication,
  message,
  notification,
];
