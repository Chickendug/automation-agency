export type ScriptContext = {
  yourName: string;
  agencyName: string;
  yourPhone: string;
  yourEmail: string;
  niche: string;
  businessName: string;
  packageName: string;
  setupFee: string;
  monthlyFee: string;
};

export function fillTemplate(template: string, ctx: Partial<ScriptContext>): string {
  const defaults: ScriptContext = {
    yourName: "Your Name",
    agencyName: "Your Automation Agency",
    yourPhone: "555-000-0000",
    yourEmail: "you@email.com",
    niche: "local service businesses",
    businessName: "their business",
    packageName: "Missed Call Recovery System",
    setupFee: "$1,500",
    monthlyFee: "$397",
  };
  const c = { ...defaults, ...ctx };
  return template
    .replace(/\[Your Name\]/g, c.yourName)
    .replace(/\[Agency Name\]/g, c.agencyName)
    .replace(/\[Your Phone\]/g, c.yourPhone)
    .replace(/\[Your Number\]/g, c.yourPhone)
    .replace(/\[Your Email\]/g, c.yourEmail)
    .replace(/\[niche\]/g, c.niche)
    .replace(/\[Niche\]/g, c.niche)
    .replace(/\[Business Name\]/g, c.businessName)
    .replace(/\[Package Name\]/g, c.packageName)
    .replace(/\[setup\]/g, c.setupFee.replace("$", ""))
    .replace(/\[monthly\]/g, c.monthlyFee.replace("$", "").replace("/mo", ""));
}
