export class Logger {
  constructor(private readonly module: string) {}

  log(msg: any) {
    return console.log(`[MissionManager - ${this.module}] LOG : ${msg}`);
  }
  info(msg: any) {
    return console.info(`MissionManager - [${this.module}] INFO : ${msg}`);
  }
  warn(msg: any) {
    return console.warn(`MissionManager - [${this.module}] WARN : ${msg}`);
  }
  error(msg: any) {
    return console.error(`MissionManager - [${this.module}] ERROR : ${msg}`);
  }
  debug(msg: any) {
    return console.debug(`MissionManager - [${this.module}] DEBUG : ${msg}`);
  }
}
