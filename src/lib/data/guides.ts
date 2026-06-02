export const GUIDES = {
  "appointment-reminders": {
    title: "Build: Appointment Reminder System",
    file: "appointment-reminders-build.md",
  },
  "deposit-hold": {
    title: "Add-On: Deposit Hold",
    file: "deposit-hold-addon.md",
  },
  "missed-call-recovery": {
    title: "Build: Missed Call Recovery",
    file: "missed-call-recovery-build.md",
  },
} as const;

export type GuideSlug = keyof typeof GUIDES;

export function getGuide(slug: string) {
  return GUIDES[slug as GuideSlug] ?? null;
}

export function guideHref(slug: GuideSlug) {
  return `/guides/${slug}`;
}
