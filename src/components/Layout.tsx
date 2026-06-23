import { COLORS, microStyles } from "@/styles/theme";

interface SectionProps {
  title: string;
  icon?: string;
  badge?: string | number;
  children: React.ReactNode;
  accent?: string;
}

export function Section({ title, icon, badge, children, accent }: SectionProps) {
  return (
    <div style={microStyles.cardStyle({ borderLeft: accent ? `3px solid ${accent}` : undefined })}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 18,
          paddingBottom: 12,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <h3
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: COLORS.green,
            flex: 1,
          }}
        >
          {title}
        </h3>
        {badge !== undefined && badge !== "" && (
          <span
            style={{
              fontSize: 11,
              background: COLORS.amberBg,
              color: COLORS.amber,
              border: `1px solid ${COLORS.amber}40`,
              borderRadius: 20,
              padding: "2px 10px",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

interface RowProps {
  children: React.ReactNode;
  cols?: string;
  gap?: number;
}

export function Row({ children, cols = "1fr 1fr", gap = 14 }: RowProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap, marginBottom: 14 }}>
      {children}
    </div>
  );
}

interface FieldProps {
  l: string;
  children: React.ReactNode;
  span?: number;
}

export function Field({ l, children, span }: FieldProps) {
  return (
    <div style={span ? { gridColumn: `span ${span}` } : {}}>
      <span style={microStyles.lbl()}>{l}</span>
      {children}
    </div>
  );
}

interface SubHeadingProps {
  children: React.ReactNode;
}

export function SubHeading({ children }: SubHeadingProps) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        color: COLORS.textMuted,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderBottom: `1px solid ${COLORS.border}`,
        paddingBottom: 6,
        marginBottom: 12,
        marginTop: 18,
      }}
    >
      {children}
    </div>
  );
}
