import { PROFILE } from "../profile.config.js";
import {
  TWIN_GATEWAY_VERSION,
  buildGatewayRequest,
  resolveTwinTurn,
  validateGatewayConfig,
  validateGatewayRequest,
  validateGatewayResponse,
} from "../twin.gateway.mjs";

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const gateway = PROFILE.conversation?.gateway;
const configValidation = validateGatewayConfig(gateway);
check(configValidation.ok, "Phase A gateway config should be valid");
check(gateway?.enabled === false, "Phase A gateway must remain disabled by default");
check(gateway?.endpoint === null, "Phase A must not choose a gateway endpoint");
check(gateway?.version === TWIN_GATEWAY_VERSION, "gateway contract version should be 0.5");

const request = buildGatewayRequest(PROFILE, "How are MyHub and CPXLABS Admin related?", [
  { id: "1", type: "PushEvent", repo: "az1nn/myhub", createdAt: "2026-09-24T00:00:00Z", commits: 2, secret: "drop-me" },
]);
check(
  JSON.stringify(Object.keys(request)) === JSON.stringify(["version", "question", "profile", "activity", "client"]),
  "gateway request should contain only versioned contract fields",
);
check(request.version === "0.5", "gateway request should use contract version 0.5");
check(validateGatewayRequest(request).ok, "constructed request should pass gateway-side schema validation");
check(request.activity[0]?.secret === undefined, "activity context should be sanitized");

const requestWithUnknownField = validateGatewayRequest({ ...request, debug: true });
check(!requestWithUnknownField.ok, "unknown request top-level fields must be rejected");

let oversizedQuestionRejected = false;
try {
  buildGatewayRequest(PROFILE, "x".repeat(281));
} catch {
  oversizedQuestionRejected = true;
}
check(oversizedQuestionRejected, "questions above the contract limit must be rejected");
check(request.client.profileVersion === "0.4.0", "Phase A should identify the current released client version");

const validPayload = {
  answer: "MyHub and CPXLABS Admin share a Spec + Graph Engineering relationship.",
  grounding: [{ kind: "project", id: "myhub" }],
  actions: [{ type: "focus-project", target: "myhub", label: "Focus MyHub" }],
  mode: "remote-grounded",
  requestId: "req-1",
};

const validResponse = validateGatewayResponse(validPayload, PROFILE);
check(validResponse.ok, "valid remote response should pass validation");
check(
  validResponse.value?.actions?.[0]?.projectId === "myhub",
  "validated remote project action should normalize to the existing client action shape",
);

const badAction = validateGatewayResponse(
  {
    ...validPayload,
    actions: [{ type: "delete-repo", target: "myhub" }],
  },
  PROFILE,
);
check(!badAction.ok, "unsupported remote actions must be rejected");

const badUnknownField = validateGatewayResponse(
  {
    ...validPayload,
    debug: "not allowed",
  },
  PROFILE,
);
check(!badUnknownField.ok, "unknown response fields must be rejected");

const missingGrounding = validateGatewayResponse(
  {
    ...validPayload,
    grounding: [],
  },
  PROFILE,
);
check(!missingGrounding.ok, "remote responses without grounding must be rejected");

let fetchCalled = false;
const disabledTurn = await resolveTwinTurn(PROFILE, "Tell me about OpenBand", {
  fetchImpl: async () => {
    fetchCalled = true;
    throw new Error("should not run");
  },
});
check(fetchCalled === false, "disabled gateway must not perform a network request");
check(disabledTurn.mode === "local-grounded", "disabled gateway should use deterministic local fallback");
check(disabledTurn.evidence?.includes("project:openband"), "local fallback should preserve graph grounding");

const enabledProfile = structuredClone(PROFILE);
enabledProfile.conversation.gateway = {
  ...enabledProfile.conversation.gateway,
  enabled: true,
  endpoint: "https://example.invalid/v1/twin/respond",
};

const remoteTurn = await resolveTwinTurn(enabledProfile, "Tell me about MyHub", {
  fetchImpl: async () => ({
    ok: true,
    async json() {
      return validPayload;
    },
  }),
});
check(remoteTurn.mode === "remote-grounded", "valid remote response should be used when the gateway is enabled");
check(remoteTurn.actions?.[0]?.projectId === "myhub", "remote action should remain allowlisted after normalization");

const rejectedTurn = await resolveTwinTurn(enabledProfile, "Tell me about MyHub", {
  fetchImpl: async () => ({
    ok: true,
    async json() {
      return {
        ...validPayload,
        actions: [{ type: "delete-repo", target: "myhub" }],
      };
    },
  }),
});
check(rejectedTurn.mode === "local-grounded", "malformed remote output must fail closed to local mode");
check(!rejectedTurn.actions?.some((action) => action.type === "delete-repo"), "rejected remote actions must never reach the client");

const networkFallback = await resolveTwinTurn(enabledProfile, "Tell me about MyHub", {
  fetchImpl: async () => {
    throw new Error("offline");
  },
});
check(networkFallback.mode === "local-grounded", "network errors must fall back locally");

if (failures.length) {
  console.error("Twin gateway validation failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

console.log("Twin gateway contract valid: disabled-by-default config, sanitized request, validated response, allowlisted actions and local fallback passed.");
