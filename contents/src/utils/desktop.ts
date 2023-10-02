export function moveToNewDesktop(client) {
  WindowState[client.internalId.toString()] = client.desktop;
  workspace.createDesktop(client.desktop, client.caption);
  client.desktop += 1;
  workspace.activeClient = client;
}

export function removeDesktop(client) {
  const remove = client.desktop - 1;
  if (WindowState[client.internalId.toString()]) {
    client.desktop = WindowState[client.internalId.toString()];
    delete WindowState[client.internalId.toString()];
  } else client.desktop = DesktopState[Object.keys(DesktopState)[0]];
  workspace.currentDesktop = client.desktop;
  workspace.activeClient = client;
  workspace.removeDesktop(remove);
}
