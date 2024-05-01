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
    this.logger.info(
      `caption :${client.caption}\ndialog: ${client.dialog}\n${client.comboBox}`
    );
    if (client.normalWindow) this.manager.startManage(client);
  }

  clientActivatedHandler(client: KWin.AbstractClient) {
    this.logger.info(`ClientActivated: ${client.resourceName}`);

    if (client.normalWindow) this.manager.checkClient(client);
  }

  clientDesktopAdded() {
    this.logger.info(`workspaceDesktopAdded: ${workspace.desktops}`);
    if (workspace.desktops > this.manager.getMaxDesktopUsed()) {
      this.manager.userDesktopAdded(workspace.desktops);
    }
  }

  clientMaximizeSet(client: KWin.AbstractClient, h: boolean, v: boolean) {
    this.logger.info(`ClientMaximized: ${client.resourceName}`);
    if (!client.normalWindow) return;
    if (h && v) return this.manager.moveToNewDesktop(client);
    else if (!h && !v) return this.manager.removeDesktop(client);
    return client.setMaximize(false, false);
  }

  clientRemoved(client: KWin.AbstractClient) {
    this.logger.info(`ClientRemoved: ${client.resourceName}`);
    this.manager.removeClient(client);
  }
}
