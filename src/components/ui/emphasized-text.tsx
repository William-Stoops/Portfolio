import { parseEmphasis } from '@/utils/parse-emphasis';

type EmphasizedTextProps = { text: string };

// Renders content strings where **passages** mark what the CV sets in bold.
export function EmphasizedText({ text }: EmphasizedTextProps) {
  return parseEmphasis(text).map(({ text: segment, isEmphasized }) =>
    isEmphasized ? (
      <strong key={segment} className="font-semibold text-fg">
        {segment}
      </strong>
    ) : (
      segment
    ),
  );
}
