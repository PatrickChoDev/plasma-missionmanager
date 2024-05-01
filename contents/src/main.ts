// import { moveToNewDesktop, removeDesktop } from "./utils/desktop";
import { Handler } from "./handler";
import { Logger } from "./utils/logger";

const logger = new Logger("MissionManager");

logger.info("Welcome to missionMananger v0.0.3");

const handler = new Handler();
workspace.clientAdded.connect((client) => {
  handler.clientAddedHandler(client);
});
workspace.clientMaximizeSet.connect((client, h, v) => {
  handler.clientMaximizeSet(client, h, v);
});
workspace.clientRemoved.connect((client) => {
  handler.clientRemoved(client);
});
workspace.currentDesktopChanged.connect((desktop, client) => {
  logger.warn(
    `currentDesktopChanged : ${desktop} ${client.resourceName} ${client.desktop}`
  );
});
workspace.clientActivated.connect((client) => {
  handler.clientActivatedHandler(client);
});

workspace.numberDesktopsChanged.connect((oldCount) => {
  logger.warn(`currentDesktopChanged : ${oldCount} ${workspace.desktops}`);
});
workspace.clientFullScreenSet.connect;
workspace.clientManaging;
