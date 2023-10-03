import { Logger } from "./utils/logger";
import { WorkspaceManager } from "./workspace";

export class Handler {
  private readonly manager: WorkspaceManager;
  private readonly logger: Logger;
  constructor() {
    this.manager = new WorkspaceManager();
    this.logger = new Logger("Handler");
  }

  clientAddedHandler(client: KWin.AbstractClient) {
    this.logger.info(`ClientAdded: ${client.resourceName}`);
    this.manager.startManage(client);
  }

  clientActivatedHandler(client: KWin.AbstractClient) {
    this.logger.info(`ClientActivated: ${client.resourceName}`);

    if (!this.manager.isManaged(client))
      return this.manager.startManage(client);
    if (client.normalWindow) this.manager.checkClient(client);
  }

  clientDesktopAdded() {}

  clientMaximizeSet(client: KWin.AbstractClient, h: boolean, v: boolean) {
    this.logger.info(`ClientActivated: ${client.resourceName}`);
    if (h && v) return this.manager.moveToNewDesktop(client);
    else if (!h && !v) return this.manager.removeDesktop(client);
    client.setMaximize(false, false);
  }
}
