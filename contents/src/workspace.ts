import { Logger } from "./utils/logger";

export class WorkspaceManager {
  private readonly logger: Logger;
  private readonly state: Map<string, number>;
  private readonly desktopStore: Map<number, string>;
  private readonly desktops: number[];
  constructor() {
    this.logger = new Logger("WorkspaceManager");
    this.state = new Map();
    this.desktopStore = new Map();
    this.desktops = [1];
    workspace.desktops = 1;
    this.initialize();
  }

  initialize() {
    this.desktopStore.set(1, "Desktop");
  }

  addNewDesktop(client: KWin.AbstractClient) {
    workspace.createDesktop(client.desktop, client.caption);
    this.desktopStore.set(client.desktop, client.caption);
  }

  getDesktopStore() {
    return this.desktopStore;
  }

  isManaged(client: KWin.AbstractClient) {
    return this.state.get(client.windowId.toString()) !== undefined;
  }

  userDesktopAdded(desktop: number) {
    this.desktops.push(desktop);
    this.desktopStore.set(desktop, "Desktop " + this.desktops.indexOf(desktop));
  }

  startManage(client: KWin.AbstractClient) {
    this.logger.info(`managing ${client.resourceName}`);
    client.setMaximize(false, false);
    if (client.desktop != 1) {
      const oldDesktop = client.desktop + 1;
      client.desktop = Array.from(this.desktopStore.keys())[0];
      workspace.activeClient = client;
      workspace.removeDesktop(oldDesktop);
    }
    this.state.set(client.windowId.toString(), 1);
  }

  moveToNewDesktop(client: KWin.AbstractClient) {
    this.logger.warn(`move ${client.resourceName} to new desktop`);
    workspace.createDesktop(
      client.desktop,
      client.resourceName as unknown as string
    );
    client.desktop += 1;
    workspace.activeClient = client;
    this.state.set(client.internalId.toString(), client.desktop);
  }

  removeDesktop(client: KWin.AbstractClient) {
    this.logger.warn(`move ${client.resourceName} to desktop`);
    const remove = client.desktop - 1;
    client.desktop = 1;
    workspace.currentDesktop = client.desktop;
    workspace.activeClient = client;
    this.state.set(client.internalId.toString(), 1);
    workspace.removeDesktop(remove);
  }

  checkClient(client: KWin.AbstractClient) {
    this.logger.warn(`checking ${client.resourceName} state`);
    if (client.desktop != this.state.get(client.internalId.toString())) {
      client.desktop = this.state.get(client.internalId.toString()) || 1;
      workspace.currentDesktop = client.desktop;
      workspace.activeClient = client;
    }
  }
}
