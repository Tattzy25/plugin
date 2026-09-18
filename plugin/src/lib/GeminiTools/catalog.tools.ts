// Auto-populated from MCP server: https://shop-easy.tattty.com/mcp
// Generated on 2026-09-18T16:18:37.709Z
export const CATALOG_TOOLS = [
  {
    "functionDeclarations": [
      {
        "name": "global_search_catalog",
        "description": "Searches for products across all Shopify merchants. The response conforms to the UCP catalog search response, including a UCP metadata envelope; products with title, description, price range (minor units), media, and variants. Use this when a customer asks for products matching criteria from any merchant, or wants to compare products across multiple stores. Some response fields (description, options, metadata.attributes, metadata.tech_specs, metadata.top_features, metadata.unique_selling_points, variants[].condition) are inferred by Shopify and may not always be present or may vary in accuracy. Treat them as discovery and merchandising signals, not as merchant-authored source text.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "catalog": {
              "type": "OBJECT",
              "properties": {
                "query": {
                  "type": "STRING",
                  "description": "Free-text search query. For example, \"trail running shoes\", \"organic coffee beans\"."
                },
                "catalog_id": {
                  "type": "STRING",
                  "description": "ID of a catalog configuration saved in the Dev Dashboard. Its filters set the request boundaries: values within them narrow the results, while values outside them fall back to the saved filters. The saved query prefix is prepended to catalog.query, combining both queries. Promoted placement can be enabled for saved catalog, refer to Earn with promoted placements for setup, payouts, and disclosure details."
                },
                "saved_catalog_slug": {
                  "type": "STRING",
                  "description": "Deprecated compatibility alias for catalog.catalog_id. Use catalog.catalog_id for new integrations. If you pass both fields, then catalog.catalog_id takes precedence."
                },
                "like": {
                  "type": "ARRAY",
                  "items": {
                    "type": "OBJECT",
                    "properties": {},
                    "additionalProperties": {}
                  },
                  "description": "Use `catalog.like` in a `search_catalog` request to find products similar to a reference product, variant, or image. Pass one item as one of: Item reference (a product or variant GID, e.g., `{\"id\": \"gid://shopify/p/...\"}`, `{\"id\": \"gid://shopify/Product/...\"}`, or `{\"id\": \"gid://shopify/ProductVariant/...\"}`), or Image content (a base64-encoded image with its MIME type, e.g., `{\"image\": {\"content_type\": \"image/jpeg\", \"data\": \"<base64>\"}}`). You can combine `like` with `query` in a single request to narrow similarity results by keyword. When `like` contains an image and `query` is present, Global Catalog uses multimodal search. Multimodal search uses the text query to describe what the agent is looking for and the image to provide visual context, such as style, shape, or pattern. When `like` contains only an image, Global Catalog uses visual similarity search, which returns items that visually resemble the image without additional text intent."
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "type": "STRING"
                    },
                    "address_region": {
                      "type": "STRING"
                    },
                    "postal_code": {
                      "type": "STRING"
                    },
                    "language": {
                      "type": "STRING"
                    },
                    "currency": {
                      "type": "STRING"
                    },
                    "intent": {
                      "type": "STRING"
                    }
                  },
                  "description": "Buyer signals for relevance and localization (address_country, address_region, postal_code, language, currency, and intent)."
                },
                "filters": {
                  "type": "OBJECT",
                  "properties": {
                    "available": {
                      "type": "BOOLEAN",
                      "description": "Filter by availability. Defaults to true (only sale-ready items). Set to false to include unavailable items."
                    },
                    "ships_to": {
                      "type": "OBJECT",
                      "properties": {
                        "country": {
                          "type": "STRING"
                        },
                        "region": {
                          "type": "STRING"
                        },
                        "postal_code": {
                          "type": "STRING"
                        }
                      },
                      "description": "Filter to products that ship to a given location. Accepts country (ISO 3166-1 alpha-2), region, and postal_code."
                    },
                    "ships_from": {
                      "type": "ARRAY",
                      "items": {
                        "type": "OBJECT",
                        "properties": {
                          "country": {
                            "type": "STRING",
                            "description": "Merchant origin country (ISO 3166-1 alpha-2)."
                          }
                        },
                        "required": [
                          "country"
                        ]
                      },
                      "description": "Filter by merchant origin country. Each entry accepts country (ISO 3166-1 alpha-2). Multiple entries use OR logic. Digital products that don't require shipping can still match this filter."
                    },
                    "price": {
                      "type": "OBJECT",
                      "properties": {
                        "min": {
                          "type": "INTEGER",
                          "minimum": -9007199254740991,
                          "maximum": 9007199254740991
                        },
                        "max": {
                          "type": "INTEGER",
                          "minimum": -9007199254740991,
                          "maximum": 9007199254740991
                        }
                      },
                      "description": "Price range in minor currency units. Accepts min and max integers. For example, {\"min\": 5000, \"max\": 20000} = $50.00–$200.00 USD."
                    },
                    "condition": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Product condition filter. Known values: \"new\", \"secondhand\". Multiple values use OR logic."
                    },
                    "shops": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Filter to specific shops. Accepts an array of shop GIDs, for example gid://shopify/Shop/987654321. You can pass up to 1000 shop IDs per request."
                    },
                    "attributes": {
                      "type": "ARRAY",
                      "items": {
                        "type": "OBJECT",
                        "properties": {},
                        "additionalProperties": {}
                      },
                      "description": "Filter by Shopify taxonomy attributes. Supported names are Color, Size, and Target gender. Entries combine with AND logic. Values within one entry combine with OR logic. Unsupported attribute names are ignored and returned in messages."
                    },
                    "rating": {
                      "type": "OBJECT",
                      "properties": {
                        "variant": {
                          "type": "OBJECT",
                          "properties": {
                            "min": {
                              "description": "The minimum rating value (0–5 scale).",
                              "type": "NUMBER",
                              "minimum": 0,
                              "maximum": 5
                            },
                            "min_count": {
                              "description": "The minimum number of reviews.",
                              "type": "INTEGER",
                              "minimum": 0,
                              "maximum": 9007199254740991
                            }
                          }
                        }
                      },
                      "required": [
                        "variant"
                      ],
                      "description": "Filter by variant rating. variant matches products with at least one variant whose rating meets the given thresholds. Set variant.min for the minimum rating value (0–5 scale) and variant.min_count for the minimum number of reviews."
                    },
                    "price_tier": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Filter by relative price tier within each product's category. Supported values are low, medium, and high. Multiple values use OR logic. Unsupported values are ignored and returned in messages."
                    },
                    "categories": {
                      "type": "ARRAY",
                      "items": {
                        "type": "OBJECT",
                        "properties": {
                          "id": {
                            "type": "STRING",
                            "description": "The taxonomy ID."
                          },
                          "taxonomy": {
                            "description": "The taxonomy source. Defaults to Shopify's standard taxonomy.",
                            "type": "STRING"
                          }
                        },
                        "required": [
                          "id"
                        ]
                      },
                      "description": "Filter by product category using taxonomy IDs. Each item accepts id (required) and taxonomy (optional, defaults to Shopify's standard taxonomy). Multiple values use OR logic."
                    }
                  },
                  "required": [
                    "available",
                    "ships_to",
                    "ships_from",
                    "price",
                    "condition",
                    "shops",
                    "attributes",
                    "rating",
                    "price_tier",
                    "categories"
                  ]
                },
                "view": {
                  "type": "STRING",
                  "description": "Predefined output shape for the response. Use \"offer\" for comparison shopping. When absent, the server returns its default shape."
                },
                "pagination": {
                  "type": "OBJECT",
                  "properties": {
                    "cursor": {
                      "type": "STRING",
                      "description": "Opaque cursor from a previous response. Pass the returned pagination.cursor as catalog.pagination.cursor to request the next page."
                    },
                    "limit": {
                      "type": "INTEGER",
                      "minimum": 1,
                      "maximum": 50,
                      "description": "Page size. Integer, min 1, default 10, max 50. You can paginate up to 1,000 results. Beyond that depth, has_next_page is false regardless of how many results match."
                    }
                  },
                  "description": "Cursor-based pagination controls. The cursor carries only the next result offset, so the request's limit controls page size. The total_count field in the response is an estimate of how many results match the query, not an exact count. Don't rely on it for precise totals or to calculate an exact number of pages."
                }
              },
              "description": "The catalog object containing the search parameters. All parameters are wrapped in a catalog object. Refer to the UCP catalog search spec for the complete schema."
            }
          },
          "required": [
            "catalog"
          ]
        }
      },
      {
        "name": "global_lookup_catalog",
        "description": "Retrieves products or variants by identifier from across all Shopify merchants. The response conforms to the UCP catalog lookup response, including products with inputs correlation on each variant and not_found messages for unresolved identifiers. Use this when you have product or variant IDs from search results or deep links, need to resolve multiple identifiers in a single request, or are validating cart items against current catalog data.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "catalog": {
              "type": "OBJECT",
              "properties": {
                "ids": {
                  "minItems": 1,
                  "maxItems": 50,
                  "type": "ARRAY",
                  "items": {
                    "type": "STRING"
                  },
                  "description": "Array of product or variant identifiers (1 to 50). Accepts gid://shopify/p/{upid}, gid://shopify/ProductVariant/{id}, and http or https Shopify product URLs. Multiple IDs that resolve to the same product are grouped into a single product in the response."
                },
                "filters": {
                  "type": "OBJECT",
                  "properties": {
                    "available": {
                      "type": "BOOLEAN",
                      "description": "Filter by availability. Defaults to true (only sale-ready items). Set to false to include unavailable items."
                    },
                    "ships_to": {
                      "type": "OBJECT",
                      "properties": {
                        "country": {
                          "type": "STRING"
                        },
                        "region": {
                          "type": "STRING"
                        },
                        "postal_code": {
                          "type": "STRING"
                        }
                      },
                      "description": "Filter to products that ship to a given location. Accepts country, region, and postal_code."
                    },
                    "ships_from": {
                      "type": "ARRAY",
                      "items": {
                        "type": "OBJECT",
                        "properties": {
                          "country": {
                            "type": "STRING",
                            "description": "Merchant origin country (ISO 3166-1 alpha-2)."
                          }
                        },
                        "required": [
                          "country"
                        ]
                      },
                      "description": "Filter by merchant origin country. Each entry accepts country (ISO 3166-1 alpha-2). Multiple entries use OR logic. Digital products that don't require shipping can still match this filter."
                    },
                    "condition": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Product condition filter. Known values: \"new\", \"secondhand\". Multiple values use OR logic."
                    },
                    "shops": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Filter to specific shops. Accepts an array of shop GIDs, for example gid://shopify/Shop/987654321. You can pass up to 1000 shop IDs per request."
                    }
                  },
                  "required": [
                    "available",
                    "ships_to",
                    "ships_from",
                    "condition",
                    "shops"
                  ]
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "type": "STRING"
                    },
                    "address_region": {
                      "type": "STRING"
                    },
                    "postal_code": {
                      "type": "STRING"
                    },
                    "language": {
                      "type": "STRING"
                    },
                    "currency": {
                      "type": "STRING"
                    },
                    "intent": {
                      "type": "STRING"
                    }
                  },
                  "description": "Buyer context for localization (address_country, address_region, postal_code, language, currency, and intent)."
                },
                "view": {
                  "type": "STRING",
                  "description": "Predefined output shape for the response. Use \"offer\" for comparison shopping. When absent, the server returns its default shape."
                }
              },
              "required": [
                "ids"
              ],
              "description": "The catalog object containing the lookup parameters. All parameters are wrapped in a catalog object. Refer to the UCP catalog lookup spec for the complete schema."
            }
          },
          "required": [
            "catalog"
          ]
        }
      },
      {
        "name": "global_get_product",
        "description": "Retrieves full details for a single product with optional variant selection. The response conforms to the UCP catalog get_product response, including product.selected reflecting effective option selections, option values with available and exists signals, and variants matching the selection. Use this when a customer has selected a product and needs full details, you need to show variant options with availability signals, or a customer is making option selections (Color, Size, and so on). Some response fields (description, options, metadata.attributes, metadata.tech_specs, metadata.top_features, metadata.unique_selling_points, variants[].condition) are inferred by Shopify and may not always be present or may vary in accuracy. Treat them as discovery and merchandising signals, not as merchant-authored source text.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "catalog": {
              "type": "OBJECT",
              "properties": {
                "id": {
                  "type": "STRING",
                  "description": "Product or variant identifier. Accepts gid://shopify/p/{upid} or gid://shopify/ProductVariant/{id}."
                },
                "selected": {
                  "type": "ARRAY",
                  "items": {
                    "type": "OBJECT",
                    "properties": {
                      "name": {
                        "type": "STRING",
                        "description": "The option name, e.g. \"Color\" or \"Size\"."
                      },
                      "label": {
                        "type": "STRING",
                        "description": "The option value label, e.g. \"Blue\" or \"10\"."
                      }
                    },
                    "required": [
                      "name",
                      "label"
                    ]
                  },
                  "description": "Option selections for variant narrowing. For example, [{\"name\": \"Color\", \"label\": \"Blue\"}, {\"name\": \"Size\", \"label\": \"10\"}]. The response reflects these selections in product.selected and filters the returned variants accordingly."
                },
                "preferences": {
                  "type": "ARRAY",
                  "items": {
                    "type": "STRING"
                  },
                  "description": "Option names in relaxation priority order. When an exact match isn't available, options are dropped from the end of this list first. For example, [\"Color\", \"Size\"] drops Size before Color."
                },
                "filters": {
                  "type": "OBJECT",
                  "properties": {
                    "ships_to": {
                      "type": "OBJECT",
                      "properties": {
                        "country": {
                          "type": "STRING"
                        },
                        "region": {
                          "type": "STRING"
                        },
                        "postal_code": {
                          "type": "STRING"
                        }
                      },
                      "description": "Filter to products that ship to a given location. Accepts country, region, and postal_code."
                    },
                    "ships_from": {
                      "type": "ARRAY",
                      "items": {
                        "type": "OBJECT",
                        "properties": {
                          "country": {
                            "type": "STRING",
                            "description": "Merchant origin country (ISO 3166-1 alpha-2)."
                          }
                        },
                        "required": [
                          "country"
                        ]
                      },
                      "description": "Filter by merchant origin country. Each entry accepts country (ISO 3166-1 alpha-2). Multiple entries use OR logic. Digital products that don't require shipping can still match this filter."
                    },
                    "available": {
                      "type": "BOOLEAN",
                      "description": "Filter by availability. Defaults to true (only sale-ready items). Set to false to include unavailable items."
                    },
                    "condition": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Product condition filter. Known values: \"new\", \"secondhand\". Multiple values use OR logic."
                    },
                    "shops": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Filter to specific shops. Accepts an array of shop GIDs, for example gid://shopify/Shop/987654321. You can pass up to 1000 shop IDs per request."
                    }
                  },
                  "required": [
                    "ships_to",
                    "ships_from",
                    "available",
                    "condition",
                    "shops"
                  ]
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "type": "STRING"
                    },
                    "address_region": {
                      "type": "STRING"
                    },
                    "postal_code": {
                      "type": "STRING"
                    },
                    "language": {
                      "type": "STRING"
                    },
                    "currency": {
                      "type": "STRING"
                    },
                    "intent": {
                      "type": "STRING"
                    }
                  },
                  "description": "Buyer context for localization (address_country, address_region, postal_code, language, currency, and intent)."
                },
                "view": {
                  "type": "STRING",
                  "description": "Predefined output shape for the response. Use \"summary\" for a condensed product detail view. When absent, the server returns its default shape."
                }
              },
              "required": [
                "id"
              ],
              "description": "The catalog object containing the product lookup parameters. All parameters are wrapped in a catalog object. Refer to the UCP catalog lookup spec for the complete schema."
            }
          },
          "required": [
            "catalog"
          ]
        }
      },
      {
        "name": "search_catalog",
        "description": "Searches the store's product catalog. The response conforms to the UCP catalog search response, including a UCP metadata envelope; products with title, description, price range (minor units), media, and variants; and cursor-based pagination. When to use: A customer asks \"Do you have any organic coffee?\", You need to find products matching specific criteria, or A customer wants to browse items in a category.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "catalog": {
              "type": "OBJECT",
              "properties": {
                "query": {
                  "type": "STRING",
                  "description": "Free-text search query. For example, \"organic coffee beans\", \"winter jacket\"."
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "description": "Localization hint for the buyer country.",
                      "type": "STRING"
                    },
                    "language": {
                      "description": "Localization hint for the buyer language.",
                      "type": "STRING"
                    },
                    "currency": {
                      "description": "Localization hint for the buyer currency.",
                      "type": "STRING"
                    },
                    "intent": {
                      "description": "The buyer's intent or shopping context.",
                      "type": "STRING"
                    }
                  },
                  "description": "Buyer signals for relevance and localization (address_country, language, currency, and intent)."
                },
                "filters": {
                  "type": "OBJECT",
                  "properties": {
                    "available": {
                      "type": "BOOLEAN",
                      "description": "Filter by availability. Defaults to true (only sale-ready items). Set to false to include unavailable items."
                    }
                  },
                  "required": [
                    "available"
                  ],
                  "description": "Availability filter. When true (default), only sale-ready items are returned. Set to false to include unavailable items."
                },
                "pagination": {
                  "type": "OBJECT",
                  "properties": {
                    "cursor": {
                      "type": "STRING",
                      "description": "Opaque cursor from a previous response. Pass the returned pagination.cursor as catalog.pagination.cursor to request the next page."
                    },
                    "limit": {
                      "type": "INTEGER",
                      "minimum": 1,
                      "maximum": 250,
                      "description": "Page size. Integer, min 1, default 10, max 250."
                    }
                  },
                  "description": "Cursor-based pagination controls. The cursor carries only the next result offset, so the request's limit controls page size."
                }
              },
              "description": "The catalog object containing the search parameters. All parameters are wrapped in a catalog object. Refer to the UCP catalog search spec for the complete schema."
            }
          },
          "required": [
            "shop_domain",
            "catalog"
          ]
        }
      },
      {
        "name": "lookup_catalog",
        "description": "Retrieves products or variants by identifier. The response conforms to the UCP catalog lookup response, including products with inputs correlation on each variant and not_found messages for unresolved identifiers. Use this when you have product or variant IDs from search results or deep links, need to resolve multiple identifiers in a single request, or are validating cart items against current catalog data.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "catalog": {
              "type": "OBJECT",
              "properties": {
                "ids": {
                  "minItems": 1,
                  "maxItems": 10,
                  "type": "ARRAY",
                  "items": {
                    "type": "STRING"
                  },
                  "description": "Array of product or variant identifiers (up to 10). For example, \"gid://shopify/Product/123\"."
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "description": "Localization hint for the buyer country.",
                      "type": "STRING"
                    },
                    "language": {
                      "description": "Localization hint for the buyer language.",
                      "type": "STRING"
                    },
                    "currency": {
                      "description": "Localization hint for the buyer currency.",
                      "type": "STRING"
                    },
                    "intent": {
                      "description": "The buyer's intent or shopping context.",
                      "type": "STRING"
                    }
                  },
                  "description": "Buyer context for localization (address_country, language, currency, and intent)."
                }
              },
              "required": [
                "ids"
              ],
              "description": "The catalog object containing the lookup parameters. All parameters are wrapped in a catalog object. Refer to the UCP catalog lookup spec for the complete schema."
            }
          },
          "required": [
            "shop_domain",
            "catalog"
          ]
        }
      },
      {
        "name": "get_product",
        "description": "Retrieves full details for a single product with optional variant selection. The response conforms to the UCP catalog get_product response, including product.selected reflecting effective option selections, option values with available and exists signals, and variants matching the selection. Use this when a customer has selected a product and needs full details, you need to show variant options with availability signals, or a customer is making option selections (Color, Size, and so on).",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "catalog": {
              "type": "OBJECT",
              "properties": {
                "id": {
                  "type": "STRING",
                  "description": "Product or variant identifier. For example, \"gid://shopify/Product/123\"."
                },
                "selected": {
                  "type": "ARRAY",
                  "items": {
                    "type": "OBJECT",
                    "properties": {
                      "name": {
                        "type": "STRING",
                        "description": "The option name, e.g. \"Color\" or \"Size\"."
                      },
                      "label": {
                        "type": "STRING",
                        "description": "The option value label, e.g. \"Blue\" or \"10\"."
                      }
                    },
                    "required": [
                      "name",
                      "label"
                    ]
                  },
                  "description": "Option selections for variant narrowing. For example, [{\"name\": \"Color\", \"label\": \"Blue\"}]. The response reflects these selections in product.selected and filters the returned variants accordingly."
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "description": "Localization hint for the buyer country.",
                      "type": "STRING"
                    },
                    "language": {
                      "description": "Localization hint for the buyer language.",
                      "type": "STRING"
                    },
                    "currency": {
                      "description": "Localization hint for the buyer currency.",
                      "type": "STRING"
                    },
                    "intent": {
                      "description": "The buyer's intent or shopping context.",
                      "type": "STRING"
                    }
                  },
                  "description": "Buyer context for localization (address_country, language, currency, and intent)."
                }
              },
              "required": [
                "id"
              ],
              "description": "The catalog object containing the product lookup parameters. All parameters are wrapped in a catalog object. Refer to the UCP catalog lookup spec for the complete schema."
            }
          },
          "required": [
            "shop_domain",
            "catalog"
          ]
        }
      },
      {
        "name": "create_cart",
        "description": "Create a new cart with line items and optional buyer context. Use this when the buyer asks to place selected catalog products into a cart. The response includes the merchant-assigned cart ID, validated line items, estimated totals, and a 'continue_url' for continuing on the merchant's storefront.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "cart": {
              "type": "OBJECT",
              "properties": {
                "line_items": {
                  "type": "ARRAY",
                  "items": {
                    "type": "OBJECT",
                    "properties": {
                      "quantity": {
                        "type": "INTEGER",
                        "minimum": 1,
                        "maximum": 9007199254740991,
                        "description": "The quantity to add for this line item."
                      },
                      "item": {
                        "type": "OBJECT",
                        "properties": {
                          "id": {
                            "type": "STRING",
                            "description": "The product variant id for this line item."
                          }
                        },
                        "required": [
                          "id"
                        ]
                      }
                    },
                    "required": [
                      "quantity",
                      "item"
                    ]
                  },
                  "description": "Array of items to add to the cart. Each item must include quantity and an item object with the product variant id."
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "description": "Localization hint for the buyer country.",
                      "type": "STRING"
                    },
                    "address_region": {
                      "description": "Localization hint for the buyer region.",
                      "type": "STRING"
                    },
                    "postal_code": {
                      "description": "Localization hint for the buyer postal code.",
                      "type": "STRING"
                    }
                  },
                  "description": "Localization hints including address_country, address_region, and postal_code. Merchants may use these as a signal for pricing, availability, and currency estimates, but context is not authoritative for shipping. If omitted, the merchant falls back to geo-IP."
                },
                "attribution": {
                  "type": "OBJECT",
                  "properties": {
                    "referring_domain": {
                      "type": "STRING"
                    },
                    "click_id_tag": {
                      "type": "STRING"
                    },
                    "click_id_value": {
                      "type": "STRING"
                    },
                    "activity_id_tag": {
                      "type": "STRING"
                    },
                    "activity_id_value": {
                      "type": "STRING"
                    },
                    "utm_campaign": {
                      "type": "STRING"
                    },
                    "utm_source": {
                      "type": "STRING"
                    },
                    "utm_medium": {
                      "type": "STRING"
                    },
                    "utm_content": {
                      "type": "STRING"
                    },
                    "utm_term": {
                      "type": "STRING"
                    }
                  },
                  "description": "Optional attribution metadata. Supported fields include referring_domain, click_id_tag, click_id_value, activity_id_tag, activity_id_value, utm_campaign, utm_source, utm_medium, utm_content, and utm_term."
                },
                "buyer": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Optional buyer information for personalized estimates."
                },
                "signals": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Optional platform-provided environment data for authorization and abuse prevention."
                }
              },
              "required": [
                "line_items"
              ],
              "description": "The cart object containing the cart data."
            }
          },
          "required": [
            "shop_domain",
            "cart"
          ]
        }
      },
      {
        "name": "get_cart",
        "description": "Retrieve the current state of an existing cart. Use this to review its contents, refresh estimated totals, or obtain the current full state before an update. If the cart does not exist or has expired, the tool may return a successful JSON-RPC result whose messages array contains an unrecoverable error with code 'not_found'. Check the returned business outcome rather than assuming that a successful transport response means the cart exists.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "id": {
              "type": "STRING",
              "description": "The ID of the cart to retrieve."
            }
          },
          "required": [
            "shop_domain",
            "id"
          ]
        }
      },
      {
        "name": "update_cart",
        "description": "Replace the contents of an existing cart. This tool uses PUT semantics: every request replaces the cart's full state with the supplied payload. Omitted fields, including 'line_items' or 'context', are removed. There is no server-side merge of partial updates. Preserve all existing state that the user has not asked to change.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "id": {
              "type": "STRING",
              "description": "The ID of the cart to update."
            },
            "cart": {
              "type": "OBJECT",
              "properties": {
                "line_items": {
                  "type": "ARRAY",
                  "items": {
                    "type": "OBJECT",
                    "properties": {
                      "quantity": {
                        "type": "INTEGER",
                        "minimum": 1,
                        "maximum": 9007199254740991,
                        "description": "The full replacement quantity for this line item."
                      },
                      "item": {
                        "type": "OBJECT",
                        "properties": {
                          "id": {
                            "type": "STRING",
                            "description": "The product variant id for this line item."
                          }
                        },
                        "required": [
                          "id"
                        ]
                      }
                    },
                    "required": [
                      "quantity",
                      "item"
                    ]
                  },
                  "description": "Full replacement array of items."
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "description": "Localization signal for the buyer country.",
                      "type": "STRING"
                    },
                    "address_region": {
                      "description": "Localization signal for the buyer region.",
                      "type": "STRING"
                    },
                    "postal_code": {
                      "description": "Localization signal for the buyer postal code.",
                      "type": "STRING"
                    }
                  },
                  "description": "Localization signals. Context is a hint for pricing, availability, and currency and is not used as the shipping address at checkout."
                },
                "attribution": {
                  "type": "OBJECT",
                  "properties": {
                    "referring_domain": {
                      "type": "STRING"
                    },
                    "click_id_tag": {
                      "type": "STRING"
                    },
                    "click_id_value": {
                      "type": "STRING"
                    },
                    "activity_id_tag": {
                      "type": "STRING"
                    },
                    "activity_id_value": {
                      "type": "STRING"
                    },
                    "utm_campaign": {
                      "type": "STRING"
                    },
                    "utm_source": {
                      "type": "STRING"
                    },
                    "utm_medium": {
                      "type": "STRING"
                    },
                    "utm_content": {
                      "type": "STRING"
                    },
                    "utm_term": {
                      "type": "STRING"
                    }
                  },
                  "description": "Attribution metadata. Because the cart object is replaced, resend attribution if you want to preserve it."
                },
                "buyer": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Optional buyer information."
                },
                "signals": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Optional platform signals."
                }
              },
              "required": [
                "line_items"
              ],
              "description": "The cart object containing the full desired cart state. Any field you omit is removed from the cart. update_cart uses PUT semantics and does not merge partial updates."
            }
          },
          "required": [
            "shop_domain",
            "id",
            "cart"
          ]
        }
      },
      {
        "name": "cancel_cart",
        "description": "Cancel an active cart. Requires meta[\"idempotency-key\"] containing a UUID, in addition to meta[\"ucp-agent\"]. Cancellation removes the cart from storage. Subsequent requests for the same cart ID return a 'not_found' business outcome. Use this only when the user requests or clearly authorizes cancellation.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "id": {
              "type": "STRING",
              "description": "The ID of the cart to cancel."
            }
          },
          "required": [
            "shop_domain",
            "id"
          ]
        }
      },
      {
        "name": "create_checkout",
        "description": "Create a new checkout session with line items, buyer information, and fulfillment preferences. Use this tool when a buyer is ready to purchase items and you need to initiate the checkout process. The response includes a `continue_url` for handing off to a trusted UI. When to use: Buyer says \"I want to buy this item\", or Agent has collected enough information to start checkout, and Buyer confirms their cart and wants to proceed.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "cart_id": {
              "type": "STRING",
              "description": "The optional ID of a cart built with Cart MCP to convert into this checkout."
            },
            "checkout": {
              "type": "OBJECT",
              "properties": {
                "currency": {
                  "type": "STRING",
                  "description": "ISO 4217 currency code, for example USD, EUR, or GBP."
                },
                "line_items": {
                  "type": "ARRAY",
                  "items": {
                    "type": "OBJECT",
                    "properties": {
                      "quantity": {
                        "type": "INTEGER",
                        "minimum": 1,
                        "maximum": 9007199254740991,
                        "description": "The quantity to purchase for this line item."
                      },
                      "item": {
                        "type": "OBJECT",
                        "properties": {
                          "id": {
                            "type": "STRING",
                            "description": "The product variant id for this line item."
                          }
                        },
                        "required": [
                          "id"
                        ]
                      }
                    },
                    "required": [
                      "quantity",
                      "item"
                    ]
                  },
                  "description": "Array of items to purchase. Each item must include quantity and an item object with the product variant id."
                },
                "buyer": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Buyer information. Contact method email or phone_number must be provided, per-merchant configuration."
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "description": "Provisional buyer signal for country.",
                      "type": "STRING"
                    },
                    "address_region": {
                      "description": "Provisional buyer signal for region.",
                      "type": "STRING"
                    },
                    "postal_code": {
                      "description": "Provisional buyer signal for postal code.",
                      "type": "STRING"
                    },
                    "intent": {
                      "description": "Provisional buyer intent signal.",
                      "type": "STRING"
                    },
                    "language": {
                      "description": "Provisional buyer language signal.",
                      "type": "STRING"
                    },
                    "currency": {
                      "description": "Provisional buyer currency signal.",
                      "type": "STRING"
                    },
                    "eligibility": {
                      "description": "Eligibility signals.",
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      }
                    }
                  },
                  "description": "Provisional buyer signals for intent, localization, currency, and eligibility decisions. A shipping address supersedes these context hints."
                },
                "attribution": {
                  "type": "OBJECT",
                  "properties": {
                    "referring_domain": {
                      "type": "STRING"
                    },
                    "click_id_tag": {
                      "type": "STRING"
                    },
                    "click_id_value": {
                      "type": "STRING"
                    },
                    "activity_id_tag": {
                      "type": "STRING"
                    },
                    "activity_id_value": {
                      "type": "STRING"
                    },
                    "utm_campaign": {
                      "type": "STRING"
                    },
                    "utm_source": {
                      "type": "STRING"
                    },
                    "utm_medium": {
                      "type": "STRING"
                    },
                    "utm_content": {
                      "type": "STRING"
                    },
                    "utm_term": {
                      "type": "STRING"
                    }
                  },
                  "description": "Optional attribution metadata. Supported fields include referring_domain, click_id_tag, click_id_value, activity_id_tag, activity_id_value, utm_campaign, utm_source, utm_medium, utm_content, and utm_term."
                },
                "discounts": {
                  "type": "OBJECT",
                  "properties": {
                    "codes": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Discount codes to apply to the checkout."
                    }
                  },
                  "required": [
                    "codes"
                  ],
                  "description": "Optional discount codes. Forward cart discount codes in checkout.discounts.codes during cart-to-checkout conversion."
                },
                "fulfillment": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Fulfillment preferences including shipping methods and destinations."
                },
                "payment": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Payment configuration including available instruments and selected_instrument_id."
                }
              },
              "description": "The checkout object containing all checkout data. Optional when cart_id is provided, in which case the cart's contents are used instead."
            }
          },
          "required": [
            "shop_domain"
          ]
        }
      },
      {
        "name": "get_checkout",
        "description": "Retrieve the current state of an existing checkout session. Use this tool to check the status of a checkout, see updated totals after changes, or verify what information is still needed before completion. When to use: Need to refresh checkout state after buyer returns, Want to show current totals and line items, or Checking if checkout is ready for payment.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "id": {
              "type": "STRING",
              "description": "The ID of the checkout session to retrieve."
            }
          },
          "required": [
            "shop_domain",
            "id"
          ]
        }
      },
      {
        "name": "update_checkout",
        "description": "Update an existing checkout session with new information. Use this tool to modify line items, update shipping address, change fulfillment method, or add buyer information before completing the checkout. When to use: Buyer wants to change quantity or remove items, Buyer provides or updates shipping address, Need to update buyer email or contact info, or Changing a delivery option. Caution: `update_checkout` uses PUT semantics. Each request replaces the full checkout state with the payload you send. Omit a field (for example `line_items` or `buyer`) and it is removed from the checkout. There is no server-side merge of partial updates. Before sending an update, remove response-only fields from the payload. `checkout.buyer.country_code` isn't accepted as input. `checkout.payment.instruments[].display` is response-only. For fulfillment updates, `checkout.fulfillment.methods[].id` is optional, but `line_item_ids` is required.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "id": {
              "type": "STRING",
              "description": "The ID of the checkout session to update."
            },
            "checkout": {
              "type": "OBJECT",
              "properties": {
                "line_items": {
                  "type": "ARRAY",
                  "items": {
                    "type": "OBJECT",
                    "properties": {
                      "id": {
                        "type": "STRING",
                        "description": "The existing checkout line item id."
                      },
                      "quantity": {
                        "type": "INTEGER",
                        "minimum": 1,
                        "maximum": 9007199254740991,
                        "description": "The updated quantity for this line item."
                      },
                      "item": {
                        "type": "OBJECT",
                        "properties": {
                          "id": {
                            "type": "STRING",
                            "description": "The product variant id for this line item."
                          }
                        },
                        "required": [
                          "id"
                        ]
                      }
                    },
                    "required": [
                      "quantity",
                      "item"
                    ]
                  },
                  "description": "Updated array of items. Replaces existing line items."
                },
                "buyer": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Updated buyer information. Contact method email or phone_number must be provided, per-merchant configuration."
                },
                "context": {
                  "type": "OBJECT",
                  "properties": {
                    "address_country": {
                      "description": "Updated provisional buyer signal for country.",
                      "type": "STRING"
                    },
                    "address_region": {
                      "description": "Updated provisional buyer signal for region.",
                      "type": "STRING"
                    },
                    "postal_code": {
                      "description": "Updated provisional buyer signal for postal code.",
                      "type": "STRING"
                    },
                    "intent": {
                      "description": "Updated provisional buyer intent signal.",
                      "type": "STRING"
                    },
                    "language": {
                      "description": "Updated provisional buyer language signal.",
                      "type": "STRING"
                    },
                    "currency": {
                      "description": "Updated provisional buyer currency signal.",
                      "type": "STRING"
                    },
                    "eligibility": {
                      "description": "Updated eligibility signals.",
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      }
                    }
                  },
                  "description": "Updated provisional buyer signals for intent, localization, currency, and eligibility decisions. A shipping address supersedes these context hints."
                },
                "attribution": {
                  "type": "OBJECT",
                  "properties": {
                    "referring_domain": {
                      "type": "STRING"
                    },
                    "click_id_tag": {
                      "type": "STRING"
                    },
                    "click_id_value": {
                      "type": "STRING"
                    },
                    "activity_id_tag": {
                      "type": "STRING"
                    },
                    "activity_id_value": {
                      "type": "STRING"
                    },
                    "utm_campaign": {
                      "type": "STRING"
                    },
                    "utm_source": {
                      "type": "STRING"
                    },
                    "utm_medium": {
                      "type": "STRING"
                    },
                    "utm_content": {
                      "type": "STRING"
                    },
                    "utm_term": {
                      "type": "STRING"
                    }
                  },
                  "description": "Attribution metadata. Because the checkout object is replaced, resend attribution if you want to preserve it."
                },
                "discounts": {
                  "type": "OBJECT",
                  "properties": {
                    "codes": {
                      "type": "ARRAY",
                      "items": {
                        "type": "STRING"
                      },
                      "description": "Updated discount codes for the checkout."
                    }
                  },
                  "required": [
                    "codes"
                  ],
                  "description": "Updated discount codes for the checkout."
                },
                "fulfillment": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Updated fulfillment preferences. Each method must include line_item_ids."
                },
                "payment": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Updated payment configuration. Do not send response-only display fields from payment.instruments."
                }
              },
              "required": [
                "line_items",
                "buyer"
              ],
              "description": "The checkout object containing the complete updated checkout state. update_checkout uses PUT semantics. Omit a field and it is removed from the checkout. There is no server-side merge of partial updates."
            }
          },
          "required": [
            "shop_domain",
            "id",
            "checkout"
          ]
        }
      },
      {
        "name": "complete_checkout",
        "description": "Submit payment and place the order. Requires `meta[\"idempotency-key\"]` (UUID) in addition to `meta[\"ucp-agent\"]`. Use this tool when the checkout is ready and the buyer has authorized payment. This finalizes the transaction and creates an order. When to use: Checkout status is `ready_for_complete`, Buyer has reviewed and confirmed the order, or Payment credential has been collected.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "id": {
              "type": "STRING",
              "description": "The ID of the checkout session to complete."
            },
            "checkout": {
              "type": "OBJECT",
              "properties": {
                "payment": {
                  "type": "OBJECT",
                  "properties": {},
                  "additionalProperties": {},
                  "description": "Checkout object containing payment credentials and finalization data. Include checkout.payment with the payment instrument and credential from the trusted UI."
                }
              },
              "required": [
                "payment"
              ],
              "description": "Checkout object containing payment credentials and finalization data."
            }
          },
          "required": [
            "shop_domain",
            "id",
            "checkout"
          ]
        }
      },
      {
        "name": "cancel_checkout",
        "description": "Cancel an active checkout session. Requires `meta[\"idempotency-key\"]` (UUID) in addition to `meta[\"ucp-agent\"]`. Use this tool when a buyer abandons the checkout or explicitly requests cancellation. Canceled checkouts can't be resumed. Cancellation expires the checkout immediately. The canceled checkout resource includes `expires_at`, which is set to the cancellation timestamp. When to use: Buyer explicitly cancels the order, Session has been abandoned, or Need to start fresh with a new checkout.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "shop_domain": {
              "type": "STRING",
              "description": "The shop domain to call. This maps to https://{shop-domain}/api/ucp/mcp."
            },
            "id": {
              "type": "STRING",
              "description": "The ID of the checkout session to cancel."
            }
          },
          "required": [
            "shop_domain",
            "id"
          ]
        }
      },
      {
        "name": "search_shop_policies_and_faqs",
        "description": "Answers questions about the store's policies, products, and services to build customer trust. When to use: A customer asks \"What's your return policy?\", You need to clarify shipping or payment options, or A customer has questions about product care or warranties. Use natural language to query the search or the search will fail.",
        "parameters": {
          "type": "OBJECT",
          "properties": {
            "store_domain": {
              "type": "STRING",
              "description": "The store domain to call. This maps to https://{storedomain}/api/mcp."
            },
            "query": {
              "type": "STRING",
              "description": "The question about policies or FAQs. For example, 'What is your return policy for sale items?'"
            },
            "context": {
              "type": "STRING",
              "description": "Additional context like the current product being viewed or the customer's situation."
            }
          },
          "required": [
            "store_domain",
            "query"
          ]
        }
      }
    ]
  }
] as const;
