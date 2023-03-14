export type AlignmentNegotiation = {
  "version": "0.1.0",
  "name": "alignment_negotiation",
  "instructions": [
    {
      "name": "setupNegotation",
      "accounts": [
        {
          "name": "negotiation",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "apprentice",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mentor",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "propose",
      "accounts": [
        {
          "name": "negotiation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "proposal",
          "type": {
            "defined": "Proposal"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "alignmentNegotiation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "parties",
            "type": {
              "array": [
                "publicKey",
                2
              ]
            }
          },
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "mentoringNft",
            "type": "publicKey"
          },
          {
            "name": "alternatives",
            "type": "publicKey"
          },
          {
            "name": "term",
            "type": "publicKey"
          },
          {
            "name": "parameters",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "protocol",
            "type": "publicKey"
          },
          {
            "name": "stakes",
            "type": "u64"
          },
          {
            "name": "termState",
            "type": {
              "defined": "NegotiationState"
            }
          },
          {
            "name": "protocolState",
            "type": {
              "defined": "NegotiationState"
            }
          },
          {
            "name": "parametersState",
            "type": {
              "defined": "NegotiationState"
            }
          },
          {
            "name": "stakesState",
            "type": {
              "defined": "NegotiationState"
            }
          },
          {
            "name": "isComplete",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "term",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "parameters",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "protocol",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "stakes",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "events",
            "type": "u16"
          },
          {
            "name": "altTerm",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "altProtocol",
            "type": {
              "option": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "NegotiationState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Empty"
          },
          {
            "name": "Discussion"
          },
          {
            "name": "Proposed",
            "fields": [
              {
                "name": "proposer",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Reviewed",
            "fields": [
              {
                "name": "proposee",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Accepted",
            "fields": [
              {
                "name": "proposee",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "NegotiationEvent",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Discuss"
          },
          {
            "name": "Propose"
          },
          {
            "name": "Review"
          },
          {
            "name": "Accept"
          },
          {
            "name": "Decline"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidNegotiationProtocol"
    },
    {
      "code": 6001,
      "name": "InvalidMentoringTerm"
    },
    {
      "code": 6002,
      "name": "ProposalHasNoChange"
    },
    {
      "code": 6003,
      "name": "ProposalAlreadySent"
    },
    {
      "code": 6004,
      "name": "ProposalAlreadyReceived"
    },
    {
      "code": 6005,
      "name": "ProposalAlreadyRejected"
    },
    {
      "code": 6006,
      "name": "ProposalAlreadyAccepted"
    },
    {
      "code": 6007,
      "name": "NegotiationAlreadyOver"
    },
    {
      "code": 6008,
      "name": "NotYourTurn"
    },
    {
      "code": 6009,
      "name": "NegotiationAlreadyStarted"
    }
  ]
};

export const IDL: AlignmentNegotiation = {
  "version": "0.1.0",
  "name": "alignment_negotiation",
  "instructions": [
    {
      "name": "setupNegotation",
      "accounts": [
        {
          "name": "negotiation",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "apprentice",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mentor",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "propose",
      "accounts": [
        {
          "name": "negotiation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "proposal",
          "type": {
            "defined": "Proposal"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "alignmentNegotiation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "parties",
            "type": {
              "array": [
                "publicKey",
                2
              ]
            }
          },
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "mentoringNft",
            "type": "publicKey"
          },
          {
            "name": "alternatives",
            "type": "publicKey"
          },
          {
            "name": "term",
            "type": "publicKey"
          },
          {
            "name": "parameters",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "protocol",
            "type": "publicKey"
          },
          {
            "name": "stakes",
            "type": "u64"
          },
          {
            "name": "termState",
            "type": {
              "defined": "NegotiationState"
            }
          },
          {
            "name": "protocolState",
            "type": {
              "defined": "NegotiationState"
            }
          },
          {
            "name": "parametersState",
            "type": {
              "defined": "NegotiationState"
            }
          },
          {
            "name": "stakesState",
            "type": {
              "defined": "NegotiationState"
            }
          },
          {
            "name": "isComplete",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "term",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "parameters",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "protocol",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "stakes",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "events",
            "type": "u16"
          },
          {
            "name": "altTerm",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "altProtocol",
            "type": {
              "option": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "NegotiationState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Empty"
          },
          {
            "name": "Discussion"
          },
          {
            "name": "Proposed",
            "fields": [
              {
                "name": "proposer",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Reviewed",
            "fields": [
              {
                "name": "proposee",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Accepted",
            "fields": [
              {
                "name": "proposee",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "NegotiationEvent",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Discuss"
          },
          {
            "name": "Propose"
          },
          {
            "name": "Review"
          },
          {
            "name": "Accept"
          },
          {
            "name": "Decline"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidNegotiationProtocol"
    },
    {
      "code": 6001,
      "name": "InvalidMentoringTerm"
    },
    {
      "code": 6002,
      "name": "ProposalHasNoChange"
    },
    {
      "code": 6003,
      "name": "ProposalAlreadySent"
    },
    {
      "code": 6004,
      "name": "ProposalAlreadyReceived"
    },
    {
      "code": 6005,
      "name": "ProposalAlreadyRejected"
    },
    {
      "code": 6006,
      "name": "ProposalAlreadyAccepted"
    },
    {
      "code": 6007,
      "name": "NegotiationAlreadyOver"
    },
    {
      "code": 6008,
      "name": "NotYourTurn"
    },
    {
      "code": 6009,
      "name": "NegotiationAlreadyStarted"
    }
  ]
};
