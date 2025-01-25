import { Container } from "inversify";
import { aclDependencies } from "./acl";
import { infrastructureDependencies } from "./infrastructures";
import { useCaseDependencies } from "./use-cases";

const container = new Container();

container.load(...aclDependencies, ...infrastructureDependencies, ...useCaseDependencies);

export { container };
