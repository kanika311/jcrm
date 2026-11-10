/**
 * TLS Certificate Expiry Monitoring Script
 * Connects to the host over TLS, inspects peer certificate validity,
 * and emits status / warning codes for automated monitoring (cron/CI/alerting).
 *
 * Usage:
 *   npx tsx scripts/check-cert-expiry.ts [hostname] [port] [warningDays]
 * Example:
 *   npx tsx scripts/check-cert-expiry.ts www.jcrm.in 443 30
 */

import * as tls from "tls";
import * as https from "https";

interface CertExpiryResult {
  host: string;
  port: number;
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  status: "OK" | "WARNING" | "CRITICAL" | "EXPIRED";
  message: string;
}

export async function checkCertExpiry(
  host: string = "www.jcrm.in",
  port: number = 443,
  warningDaysThreshold: number = 30
): Promise<CertExpiryResult> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: host,
        rejectUnauthorized: false, // Inspect cert even if staging/self-signed/expired
        timeout: 10000,
      },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();

        if (!cert || !cert.valid_to) {
          reject(new Error(`No peer certificate returned for ${host}:${port}`));
          return;
        }

        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const msRemaining = validTo.getTime() - now.getTime();
        const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));

        let status: CertExpiryResult["status"] = "OK";
        let message = `Certificate valid for ${daysRemaining} more days.`;

        if (daysRemaining <= 0) {
          status = "EXPIRED";
          message = `CRITICAL: Certificate expired on ${validTo.toISOString()}!`;
        } else if (daysRemaining <= 7) {
          status = "CRITICAL";
          message = `CRITICAL: Certificate expires in only ${daysRemaining} days! Immediate renewal required.`;
        } else if (daysRemaining <= warningDaysThreshold) {
          status = "WARNING";
          message = `WARNING: Certificate expires in ${daysRemaining} days (threshold: ${warningDaysThreshold}).`;
        }

        resolve({
          host,
          port,
          subject: (cert.subject as any)?.CN || JSON.stringify(cert.subject),
          issuer: (cert.issuer as any)?.O || (cert.issuer as any)?.CN || JSON.stringify(cert.issuer),
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          daysRemaining,
          status,
          message,
        });
      }
    );

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error(`Connection to ${host}:${port} timed out after 10000ms.`));
    });

    socket.on("error", (err) => {
      reject(err);
    });
  });
}

// CLI runner
if (require.main === module || process.argv[1]?.includes("check-cert-expiry")) {
  const host = process.argv[2] || "www.jcrm.in";
  const port = parseInt(process.argv[3] || "443", 10);
  const threshold = parseInt(process.argv[4] || "30", 10);

  checkCertExpiry(host, port, threshold)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      if (result.status === "EXPIRED" || result.status === "CRITICAL") {
        process.exit(2);
      } else if (result.status === "WARNING") {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error(`[Cert Expiry Check Failed]:`, err.message);
      process.exit(1);
    });
}

