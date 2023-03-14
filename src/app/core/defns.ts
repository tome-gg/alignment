export enum NegotiationState {
  Discuss = "discuss",
  Propose = "propose",
  Review = "review",
  Accept = "accept"
}

// Generates a `number` usable to represent the event for the alignment negotiation.
export function createNegotiationEvent(
  action: "discuss" | "propose" | "review" | "accept",
  negotiationElement: "term" | "protocol" | "parameters" | "stake"
): number {
  let exponent = 0, value = 0;
  switch (action) {
    case "discuss":
      exponent = 16;
      break;
    case "propose":
      exponent = 8;
      break;
    case "review":
      exponent = 4;
      break;
    case "accept":
      exponent = 0;
      break;
  }

  switch (negotiationElement) {
    case "term":
      value = 8;
      break;
    case "protocol":
      value = 4;
      break;
    case "parameters":
      value = 2;
      break;
    case "stake":
      value = 1;
      break;
  }

  let encoding = value << exponent;

  return encoding;
}