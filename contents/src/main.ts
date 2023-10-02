import { Logger } from "./utils/logger";

const logger = new Logger();

const DesktopState = {};

const WindowState = new Map<string, string>();

function moveToNewDesktop(client: KWin.AbstractClient) {
  WindowState.set(client.internalId.toString(), client.desktop);
  workspace.createDesktop(client.desktop, client.caption);
  client.desktop += 1;
  workspace.activeClient = client;
}

function removeDesktop(client: KWin.AbstractClient) {
  const remove = client.desktop - 1;
  if (WindowState[client.internalId.toString()]) {
    client.desktop = WindowState[client.internalId.toString()];
    delete WindowState[client.internalId.toString()];
  } else client.desktop = DesktopState[Object.keys(DesktopState)[0]];
  workspace.currentDesktop = client.desktop;
  workspace.activeClient = client;
  workspace.removeDesktop(remove);
}

logger.log("Mission Manager Started");

workspace.clientAdded.connect((client) => {
  if (client.windowType !== 0) return;
  logger.info(`Found new window: ${client} - ${client.caption}`);
  logger.info("NormalWindow!!:" + client.normalWindow);
  logger.info("Modal!!:" + client.modal);
  logger.info("Modal!!:" + client.modal);
  logger.info("popupWindow!!:" + client.popupWindow);
  logger.info("internalId!!:" + client.internalId);
  logger.info("desktop!!:" + client.desktop);
});

workspace.clientMaximizeSet.connect((client, h, v) => {
  if (client.windowType !== 0) return;
  if (h && v) {
    logger.info(`Detected MAXIMIZED window: ${client.caption}`);
    moveToNewDesktop(client);
  }
  if (!h || !v) {
    logger.info(`Detected UNMAXIMIZED window: ${client.caption}`);
    removeDesktop(client);
  }
});

workspace.clientFullScreenSet.connect((client, full, user) => {
  if (client.windowType !== 0) return;
  if (full) {
    logger.info(`Detected FULLSCREEN window: ${client.caption}`);
    moveToNewDesktop(client);
  } else {
    logger.info(`Detected UNFULLSCREEN window: ${client.caption}`);
    removeDesktop(client);
  }
});
