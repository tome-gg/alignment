import { DateTime } from "luxon";
import { ChatMessage } from "./ink.component";

export const Data = [
  {
    "id": "1",
    "type": "user",
    "user": {
      "imageUrl": "https://placehold.co/32x32",
      "username": "Patient Grasshopper"
    },
    "message": "Hello! I am curious about how to get into tech but I am not sure how. I am doing bootcamps right now. Is that okay?",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.766Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  },
  {
    "id": "2",
    "type": "ai",
    "user": {
      "imageUrl": "assets/ink.png",
      "username": "Ink"
    },
    "message": "Hi there person!",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.767Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  },
  {
    "id": "3",
    "type": "ai_thought",
    "user": {
      "imageUrl": "assets/ink.png",
      "username": "Ink"
    },
    "message": "The person is interested to transition into tech, but is uncertain about how to proceed. Useful information to provide might be learning resources, or roadmaps.",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.767Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  },
  {
    "id": "4",
    "type": "peer",
    "user": {
      "imageUrl": "https://placehold.co/32x32",
      "username": "Darren"
    },
    "message": "Hi Patient Grasshopper, nice to meet  you! I'm Darren, a mentor in Tome.gg. I highly recommend you check out <a class='link cursor' href='https://roadmap.sh'>Roadmap.sh</a> which provides some guidance and options for career paths in tech.",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.767Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  },
  {
    "id": "5",
    "type": "ai_thought",
    "user": {
      "imageUrl": "assets/ink.png",
      "username": "Ink"
    },
    "message": "This demo illustrates the interactions between a AI copilot (Ink), a coach or a peer (Darren), and you, a learner (in this case: Patient Grasshopper).",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.767Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  },
  {
    "id": "6",
    "type": "ai",
    "user": {
      "imageUrl": "assets/ink.png",
      "username": "Ink"
    },
    "message": "As the AI learning copilot, I will help prompt you, ask you questions, support you, and bridge the connection and information gap between you and your mentor, as well as bridge the information gap between what you want to learn and the resources on the internet.",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.767Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  },
  {
    "id": "7",
    "type": "ai",
    "user": {
      "imageUrl": "assets/ink.png",
      "username": "Ink"
    },
    "message": "As you continue to learn, I will generate uniquely personalized learning roadmaps for you, such as ones found in <a class='cursor link' href='https://map.tome.gg'>Tome.gg's Adaptive Map</a>.",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.767Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  },
  {
    "id": "8",
    "type": "user",
    "user": {
      "imageUrl": "https://placehold.co/32x32",
      "username": "Patient Grasshopper"
    },
    "message": "Okay, this looks very promising. When will Ink be available?",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.767Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  },
  {
    "id": "9",
    "type": "ai",
    "user": {
      "imageUrl": "assets/ink.png",
      "username": "Ink"
    },
    "message": "I'm glad to hear that! We can inform you when I'm ready if you <a class='cursor link' href='https://waitlist.tome.gg/ink'>join the waitlist</a> for Ink.",
    "timestamp": DateTime.fromISO("2024-07-12T06:38:37.767Z").toJSDate(),
    "timestampReadable": "7/11/2024, 11:38 PM",
    "timestampRaw": "now"
  }
] as ChatMessage[]