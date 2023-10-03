// import { moveToNewDesktop, removeDesktop } from "./utils/desktop";
import { Handler } from "./handler";
import { Logger } from "./utils/logger";

const logger = new Logger("MissionManager");

logger.info("Welcome to missionMananger v0.0.2");

const handler = new Handler();
workspace.clientAdded.connect;
workspace.clientMaximizeSet.connect((client, h, v) => {
  handler.clientMaximizeSet(client, h, v);
});
workspace.clientFullScreenSet.connect;
workspace.clientManaging;
workspace.clientRemoved.connect;
workspace.currentDesktopChanged.connect((desktop, client) => {
  logger.warn(
    `currentDesktopChanged : ${desktop} ${client.resourceName} ${client.desktop}`
  );
});

workspace.clientActivated.connect((client) => {
  handler.clientActivatedHandler(client);
});

workspace.numberDesktopsChanged.connect((oldCount) => {
  logger.warn(`currentDesktopChanged : ${oldCount}`);
});
