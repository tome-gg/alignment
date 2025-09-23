export interface Peer {
  name: string;
  githubUsername: string;
  repositoryPath: string;
  trainingFile: string;
  evalFile: string;
}

export interface PeerGroup {
  title: string;
  peers: Peer[];
}