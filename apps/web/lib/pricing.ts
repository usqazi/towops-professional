// Pricing tiers for different business sizes
const PRICING_TIERS = {
  STARTER: {
    name: "Starter",
    price: 29,
    trucks: 2,
    dispatches: 60,
    sms: 120,
    features: ["Basic dispatch", "Mobile app", "Simple reports"]
  },
  PROFESSIONAL: {
    name: "Professional", 
    price: 99,
    trucks: 10,
    dispatches: 500,
    sms: 1000,
    features: ["AI support", "NSV QA", "Advanced analytics", "API access"]
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 299,
    trucks: 50,
    dispatches: 2000,
    sms: 5000,
    features: ["Custom integrations", "White-label", "Priority support", "Advanced AI"]
  }
}
