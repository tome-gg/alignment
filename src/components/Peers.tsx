'use client';

import {
  Box,
  Typography,
  List,
  ListItem,
  Link,
  Paper,
  Chip,
  Container
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { Peer, PeerGroup } from '../types/peers';

interface PeersProps {
  peerGroups?: PeerGroup[];
}

const constructTomeUrl = (peer: Peer) => {
  let baseUrl = "https://tome.gg";
  if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:3000";
  }
  const params = new URLSearchParams({
    source: `github.com/${peer.githubUsername}/${peer.repositoryPath}`,
    training: peer.trainingFile,
    eval: peer.evalFile
  });

  return `${baseUrl}?${params.toString()}`;
}

const defaultPeers: Peer[] = [
  {
    name: "Darren Sapalo",
    githubUsername: "darrensapalo",
    repositoryPath: "founder",
    trainingFile: "dsu-reports-q3-2025.yaml",
    evalFile: "eval-self.yaml"
  },
  {
    name: "Example Learner",
    githubUsername: "example-user",
    repositoryPath: "learning-journey",
    trainingFile: "training.yaml",
    evalFile: "evaluation.yaml"
  }
];

const defaultPeerGroups: PeerGroup[] = [
  {
    title: "Fellow Learners",
    peers: defaultPeers
  }
];

function generateTomeUrl(peer: Peer): string {
  const baseUrl = "https://tome.gg";
  const params = new URLSearchParams({
    source: `github.com/${peer.githubUsername}/${peer.repositoryPath}`,
    training: peer.trainingFile,
    eval: peer.evalFile
  });

  return `${baseUrl}?${params.toString()}`;
}

function PeerListItem({ peer }: { peer: Peer }) {
  const tomeUrl = generateTomeUrl(peer);

  return (
    <ListItem sx={{ px: 0, py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <PersonIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Link
            href={tomeUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 'medium',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
          >
            {peer.name}
          </Link>
          <Box sx={{ mt: 0.5 }}>
            <Link href={constructTomeUrl(peer)} rel="noopener noreferrer" sx={{ cursor: 'pointer' }}>
            <Chip
              label={`@${peer.githubUsername}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem', height: '20px' }}
            />
            </Link>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}

function PeerGroupSection({ group }: { group: PeerGroup }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        variant="outlined"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 2
        }}
      >
        <Typography
        variant="h6"
        component="h3"
        sx={{
          mb: 1,
          fontWeight: 'medium',
          color: 'text.primary'
        }}
      >
        {group.title}
      </Typography>
        <List sx={{ py: 0 }}>
          {group.peers.map((peer, index) => (
            <PeerListItem key={`${peer.githubUsername}-${index}`} peer={peer} />
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default function Peers({ peerGroups = defaultPeerGroups }: PeersProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box sx={{ mb: 4 }}>
      {peerGroups.map((group, index) => (
        <PeerGroupSection key={`${group.title}-${index}`} group={group} />
      ))}
    </Box>
    </Container>
  );
}