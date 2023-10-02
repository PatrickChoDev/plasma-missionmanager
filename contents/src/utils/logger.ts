export class Logger {
  log(msg: string) {
    return console.log(`[LOG] MissionManager: ${msg}`);
  }
  info(msg: string) {
    return console.info(`[INFO] MissionManager: ${msg}`);
  }
  warn(msg: any) {
    return console.info(`[WARN] MissionManager: ${msg}`);
  }
  error(msg: any) {
    return console.info(`[ERROR] MissionManager: ${msg}`);
  }
  debug(msg: any) {
    return console.info(`[DEBUG] MissionManager: ${msg}`);
  }
}
