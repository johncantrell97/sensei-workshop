import SenseiClient from "@l2-technology/sensei-client";
import { fundAddress, mineBlocks, generateNodeCredentials, waitForChannelsToBeUsable } from "./utils.js"

const ROOT_USERNAME = "root"
const ROOT_PASSWORD = "root"
const ROOT_ALIAS = "root"
const NODES = 1000;

async function main() {
  const client = new SenseiClient({ basePath:"http://127.0.0.1:5401"});

  const status = await client.getStatus()
  console.log(`sensei v${status.version} running`);

  let rootMacaroon;

  if(!status.created) {
    console.log(`root node not created yet, creating with username ${ROOT_USERNAME}`);
    let { macaroon, token } = await client.init({ username: ROOT_USERNAME, alias: ROOT_ALIAS, passphrase: ROOT_PASSWORD, start: true })
    client.setToken(token)
    rootMacaroon = macaroon;
  } else {
    console.log(`root node exists, logging in to get credentials`);
    let { macaroon, token } =  client.login(ROOT_USERNAME, ROOT_PASSWORD);
    client.setToken(token)
    rootMacaroon = macaroon;
  }

  client.setMacaroon(rootMacaroon);

  let { address } = await client.getUnusedAddress();
  await fundAddress(address)
  
  let credentials = generateNodeCredentials(NODES);

  let createNodes = credentials.map(user => {
    return {
      alias: user.alias,
      username: user.username,
      passphrase: user.passphrase,
      start: true
    }
  });

  let nodes = await client.batchCreateNode(createNodes);

  let channelOpens = nodes.map(node => {
    return {
      nodeConnectionString: `${node.pubkey}@127.0.0.1:${node.listen_port}`,
      isPublic: true,
      amtSatoshis: 10000,
    }
  })

  const channelOpenResponses = await client.openChannels(channelOpens);

  await mineBlocks(6)

  await waitForChannelsToBeUsable(client, channelOpenResponses)

  let satsToSend = 1000;
  for(let i=0;i<nodes.length;i++) {
    client.setMacaroon(nodes[i].macaroon)
    let { invoice } = await client.createInvoice(satsToSend * 1000, "test payment");
    
    client.setMacaroon(rootMacaroon);
    await client.payInvoice(invoice)
  }
}

main()