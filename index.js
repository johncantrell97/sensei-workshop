import SenseiClient from "@l2-technology/sensei-client";
import { fundAddress, mineBlocks, generateNodeCredentials, waitForChannelsToBeUsable } from "./utils.js"

const ROOT_USERNAME = "root"
const ROOT_PASSWORD = "root"
const ROOT_ALIAS = "root"
const NODES = 1000

async function main() {
  // create a sensei client
  
  // get status of the sensei instance

  
  // if the root node hasn't been initialized, init it
  // otherwise we login using our user/pass
  

  // set the client to use the root node macaroon

  // get an unused address and fund the node
  
  // generate users for the nodes we are going to create
  // and map them to match batchCreateNode arguments
  

  // batch create all of the nodes

  // create the new channel open requests for each of the nodes
  

  // open the channels

  // mine some blocks

  // for each node, create an invoice and then have the root node pay it
}

main()