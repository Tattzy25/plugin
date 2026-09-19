export const UI_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "get_ui_state",
        description: "Retrieve the current state of the Commerce Layer. Use this tool to verify what the buyer is currently seeing on their screen, including selected product variants, cart contents, and the current stage of the shopping progression.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
    ],
  },
] as const;
