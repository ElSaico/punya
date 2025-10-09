import { Resource } from "sst";
import { Example } from "@punya/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
