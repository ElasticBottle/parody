/* tslint:disable */
/* eslint-disable */
/// <reference path="../../sst-env.d.ts" />
// cloudflare 
declare module "sst" {
  export interface Resource {
    "StorageBucket": import("@cloudflare/workers-types").R2Bucket
  }
}
export {}
