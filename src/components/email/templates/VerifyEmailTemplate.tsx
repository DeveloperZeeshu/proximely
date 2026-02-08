import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from "@react-email/components";

type VerifyEmailProps = {
  verifyUrl: string;
  userName?: string;
};

const styles = {
    body: {
        backgroundColor: "#f3f4f6",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        margin: 0,
        padding: "32px 0",
    },

    container: {
        maxWidth: "520px",
        margin: "0 auto",
        padding: "0 16px",
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
    },

    logo: {
        fontSize: "20px",
        fontWeight: "700",
        margin: "0 0 24px",
    },

    heading: {
        fontSize: "22px",
        fontWeight: "600",
        margin: "0 0 16px",
        color: "#111827",
    },

    text: {
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#374151",
        margin: "0 0 16px",
    },

    buttonWrapper: {
        textAlign: "center" as const,
        margin: "32px 0",
    },

    button: {
        backgroundColor: "#111827",
        color: "#ffffff",
        padding: "12px 20px",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        textDecoration: "none",
        display: "inline-block",
    },

    muted: {
        fontSize: "13px",
        color: "#6b7280",
        marginBottom: "24px",
    },

    divider: {
        borderColor: "#e5e7eb",
        margin: "24px 0",
    },

    footer: {
        fontSize: "12px",
        color: "#9ca3af",
        margin: "8px 0 0",
        textAlign: "center" as const,
    },
};


export function VerifyEmailTemplate({
  verifyUrl,
  userName = "there",
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            {/* Header */}
            <Heading style={styles.logo}>
              Proximely
            </Heading>

            <Heading style={styles.heading}>
              Confirm your email to get started
            </Heading>

            <Text style={styles.text}>
              Hi {userName},
            </Text>

            <Text style={styles.text}>
              Thanks for signing up for <strong>Proximely</strong>.
              Please confirm your email address to activate your account
              and access your dashboard.
            </Text>

            {/* CTA */}
            <Section style={styles.buttonWrapper}>
              <Button href={verifyUrl} style={styles.button}>
                Verify Email
              </Button>
            </Section>

            <Text style={styles.muted}>
              This link will expire in 10 minutes for security reasons.
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.footer}>
              If you didn’t create an account, you can safely ignore this email.
            </Text>

            <Text style={styles.footer}>
              © {new Date().getFullYear()} Proximely
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
