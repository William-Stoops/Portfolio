export type SkillGroup = {
  // Stable identifier, used for anchors and heading ids.
  id: string;
  name: string;
  skills: readonly string[];
};
