const PORT = 8080

export const webServer = {
  command: `npx http-server test/fixtures -p ${PORT}`,
  port: PORT
}

export const use = {
  baseUrl: `http://localhost:${PORT}`
}
