import * as Name from 'w3name';
import fs from 'fs';

async function saveSigningKey(name:any, outputFilename:any) {
  const bytes = name.key.bytes;
  const name_string = name.toString();
  await fs.promises.writeFile(outputFilename+'.key', bytes);
  await fs.promises.writeFile(outputFilename+'.name', name_string);
}

async function loadSigningKey(key:any) {
  const bytes = await fs.promises.readFile(key+'.key');
  const name = await Name.from(bytes);
  return name;
}

const update = async (key:string, ipns: string, new_ipfs:string) => {
  const name = await loadSigningKey(key);
  const lastest_name = Name.parse(ipns);
  const revision = await Name.resolve(lastest_name);
  const nextValue = '/ipfs/'+new_ipfs;
  const nextRevision = await Name.increment(revision, nextValue);
  await Name.publish(nextRevision, name.key);
  console.log('updated name: ', name.toString());
};

const create = async (ipfs:string, key:string) => {
  const name = await Name.create();
  console.log('created new name: ', name.toString());
  const value = '/ipfs/'+ipfs;
  const revision = await Name.v0(name, value);
  await Name.publish(revision, name.key);
  saveSigningKey(name, key);
}

create('bafkreidluyrdonmwob336fudptj6k5xiaa7abqt6rgnbmk56xcue3qmj6m','haveaniceday');