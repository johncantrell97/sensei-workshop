import { exec } from "child_process";
import { faker } from "@faker-js/faker";

function asyncExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err) => {
      if(err) { 
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export async function fundAddress(address) {
  await asyncExec(`nigiri faucet ${address}`)
}

export async function mineBlocks(blocks) {
  await asyncExec(`nigiri rpc generatetoaddress ${blocks} $(nigiri rpc getnewaddress \"\" \"bech32\")`)
}

export function generateNodeCredentials(numNodes) {
  let credentials = [];
  for(let i=0;i<numNodes;i++){
    credentials.push({
      alias: faker.random.alphaNumeric(16),
      username: faker.random.alphaNumeric(16),
      passphrase: "password",
    })
  }
  return credentials
}

export async function waitForChannelsToBeUsable(client, {channels, results}) {
  let openedChannels = 0;
  for(let i=0;i<results.length;i++){
    if(!results[i].error) {
      openedChannels++;
    }
  }

  let usableChannels = 0;

  while(usableChannels < openedChannels) {
    let { channels } = await client.getChannels({ page: 0, take: openedChannels, searchTerm: "" })
    
    usableChannels = 0;
    
    for(let i=0;i<channels.length;i++) {
      if(channels[i].isUsable) {
        usableChannels += 1;
      }
    }

    if(usableChannels < openedChannels) {
      await sleep(1000)
    }
  }
}