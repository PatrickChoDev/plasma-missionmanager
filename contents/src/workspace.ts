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

  getMaxDesktopUsed() {
    this.logger.info(
      `Desktop used: ${Math.max(...Array.from(this.state.values()))}`
    );
    return Math.max(...Array.from(this.state.values()));
  }

  isManaged(client: KWin.AbstractClient) {
    return this.state.get(client.windowId.toString()) !== undefined;
  }

  isMaximized(client: KWin.AbstractClient) {
    var area = workspace.clientArea(KWin.MaximizeArea, client);
    return client.width + 1 >= area.width && client.height + 1 >= area.height;
  }

  userDesktopAdded(desktop: number) {
    this.desktopStore.set(desktop, "Desktop " + this.desktops.indexOf(desktop));
  }

  startManage(client: KWin.AbstractClient) {
    this.logger.info(`starting manage ${client.resourceName}`);
    if (!this.desktops.includes(client.desktop)) {
      this.logger.error("hi");
      const oldDesktop = client.desktop;
      client.desktop = 1;
      workspace.activeClient = client;
      if (!Array.from(this.desktopStore.keys()).includes(oldDesktop))
        workspace.removeDesktop(oldDesktop);
    }
    this.state.set(client.windowId.toString(), client.desktop);
    // this.recheckDesktop();
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
    if (this.state.get(client.internalId.toString()) === undefined) {
      client.desktop = 1;
      return this.startManage(client);
    }
    if (client.desktop != this.state.get(client.internalId.toString())) {
      client.desktop = this.state.get(client.internalId.toString()) || 1;
      workspace.currentDesktop = client.desktop;
      workspace.activeClient = client;
      this.state.set(client.internalId.toString(), client.desktop);
    }
    // this.recheckDesktop();
  }

  recheckDesktop() {
    for (var i = workspace.desktops - 1; i >= this.getMaxDesktopUsed(); i--) {
      workspace.removeDesktop(i);
    }
  }

  removeClient(client: KWin.AbstractClient) {
    if (this.isManaged(client)) {
      this.logger.warn(
        `unwatch ${client.resourceName} ${client.internalId.toString()}`
      );
      workspace.currentDesktop = this.desktops[0];
      workspace.removeDesktop(
        this.state.get(client.internalId.toString()) || workspace.desktops - 1
      );
      this.state.delete(client.internalId.toString());
    }
  }
}
