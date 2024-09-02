export const domain =
	{
		dev: "https://parody-dev-apiscript.winstonyeo99.workers.dev",
		production: "https://parody-production-apiscript.winstonyeo99.workers.dev",
	}[$app.stage] ??
	"https://parody-elasticbottle-apiscript.winstonyeo99.workers.dev";
