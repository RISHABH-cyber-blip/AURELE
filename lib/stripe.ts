type StripeEventLike = {
  type: string
  data: {
    object: any
  }
}

type StripeLike = {
  webhooks: {
    constructEvent: (payload: string, signature: string, secret: string) => StripeEventLike
  }
}

const stripeClient: StripeLike = {
  webhooks: {
    constructEvent: () => ({ type: 'checkout.session.completed', data: { object: {} } }),
  },
}

export const stripe = stripeClient
