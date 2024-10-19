export const domain =
  {
    dev: "https://dev.scalenelab.com",
    production: "https://scalenelab.com",
  }[$app.stage] ??
  "https://parody-elasticbottle-apiscript.winstonyeo99.workers.dev";
