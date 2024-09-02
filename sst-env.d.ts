/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "Api": {
      "type": "sst.cloudflare.Worker"
      "url": string
    }
    "StorageBucket": {
      "type": "sst.cloudflare.Bucket"
    }
    "StripePublic": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "StripeSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "StripeWebhook": {
      "id": string
      "secret": string
      "type": "stripe.index/webhookEndpoint.WebhookEndpoint"
    }
    "WWW": {
      "type": "sst.cloudflare.StaticSite"
      "url": string
    }
  }
}
export {}
