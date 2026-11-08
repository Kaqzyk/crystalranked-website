// ─────────────────────────────────────────────────────────────
//  CrystalRanked store data — edit this file to change the store.
//  Products and prices are copied from the live
//  Tebex store (store.crystalranked.net) on 2026-11-08; descriptions lightly edited for grammar.
//  `id` is the Tebex package ID.
// ─────────────────────────────────────────────────────────────

export const config = {
  name: 'Crystal Ranked',
  ip: 'crystalranked.org',
  discord: 'https://discord.gg/crystalranked',
  discordLabel: 'discord.gg/crystalranked',
  tebex: 'https://store.crystalranked.net',
  currency: 'USD',
  sale: { active: false, percent: 0, label: '', endsAt: '' },
};

export const categories = [
  { id: 'ranks', facts: ['Monthly subscription', 'Cancel any time in Tebex'], color: '#ffc83d', name: 'Ranks', icon: 'crown', blurb: 'Monthly ranks. Cancel any time in Tebex.' },
  { id: 'practice', facts: ['HT3+ only', 'Whitelisted within 5 minutes', 'Includes MCTiers server'], color: '#45c8ff', name: 'Private Practice', icon: 'lock', blurb: 'Whitelist access to the HT3+ practice servers.' },
  { id: 'events', facts: ['Token added after purchase', 'You pick the event settings', 'Ping goes out instantly'], color: '#b77bff', name: 'Event Tokens', icon: 'megaphone', blurb: 'Buy a token, then redeem it to host your own event.' },
  { id: 'punishments', facts: ['Blacklisted offences excluded', 'Ask staff if unsure'], color: '#ff5a5a', name: 'Punishments', icon: 'barrier', blurb: 'Remove a ban or mute from your account.' },
];

const eventOptions = {
  title: 'Event settings you control',
  items: [
    'Kits — Turn /kit on or off',
    'Kit Room — Turn /kitroom on or off',
    'Kit Cooldown — Adds a 60-second cooldown between rekits (needs Kits on)',
    'Hide Mode — Players can only see their own party',
    'Protect the President — Each party has to protect its leader. If the leader dies, the whole team dies',
    'Party Size — 2, 4, 6 or 8 players per party',
    'Revive All (Phase 1 Drop) — Revives every player at the Phase 1 drop',
    'Revive All (Phase 2 Drop) — Revives every player at the Phase 2 drop',
    'Gulag Every 10 Deaths — Runs /gulag every 10 deaths (you can change the number)',
    'Rekit Every 15 Deaths — Rekits every player every 15 deaths (can\'t be combined with Kit Cooldown)',
  ],
};
const eventSteps = (role) => [
  'The token is added to your account automatically after you buy',
  'Join the event server and run /event',
  'Run /eventcmd redeem',
  `Select the ${role} role ping`,
  'Set up your event and click Start. The token is used up and the ping goes out instantly',
];
const blacklist = (what) =>
  `If your ${what} was for doxing, DDoSing, swatting or harassment, it's blacklisted and you can't buy an ${what === 'ban' ? 'unban' : 'unmute'}. Buying one anyway won't get you a refund. Not sure if you're eligible? Ask staff at discord.gg/crystalranked.`;

export const products = [
  // Ranks (monthly subscriptions)
  {
    id: 6854042, cat: 'ranks', name: 'Plus Rank', price: 4.99, type: 'subscribe', icon: 'star', color: '#ffc83d',
    short: 'Lets you edit your bot skin with +.',
    details: ['Lets you edit your bot skin with +.', 'This subscription renews every month. You can cancel it any time in Tebex.'],
  },
  {
    id: 7084820, cat: 'ranks', name: 'Ranked Rank', price: 24.99, type: 'subscribe', icon: 'crown', color: '#ff1769', featured: true,
    short: 'Our top rank.', // TODO: no description on the live store yet — add the real perks
    details: ['This subscription renews every month. You can cancel it any time in Tebex.'],
  },

  // Private practice
  {
    id: 7119168, cat: 'practice', name: 'Private Practice Whitelist', sub: 'Includes the MCTiers server', price: 7.99, type: 'subscribe', icon: 'lock', color: '#45c8ff',
    short: 'Access to our private practice servers. HT3+ only.',
    details: [
      'Get access to private.crystalranked.org and mctiers.crystalranked.org, our private practice servers for HT3+ players only.',
      'The best place to fight the best of the best.',
      "You're whitelisted automatically within 5 minutes of buying.",
    ],
  },

  // Event tokens
  {
    id: 7364025, cat: 'events', name: '@Event Ping Token', price: 4.99, type: 'single', icon: 'megaphone', color: '#b77bff',
    short: 'Pings the @event role when your event starts.',
    details: ["Take full control of your next in-game event. When you're ready to start, use the token to ping the @event Discord role and notify everyone who has it."],
    list: eventOptions, steps: eventSteps('@event'),
  },
  {
    id: 7364323, cat: 'events', name: '@Here Ping Token', price: 14.99, type: 'single', icon: 'chat', color: '#ff7ab0',
    short: 'Sends an @here ping when your event starts.',
    details: ["Take full control of your next in-game event. When you're ready to start, use the token to send an @here ping in our Discord and notify everyone online."],
    list: eventOptions, steps: eventSteps('@here'),
  },
  {
    id: 7364324, cat: 'events', name: '@Everyone Ping Token', price: 19.99, type: 'single', icon: 'group', color: '#ff8a3d',
    short: 'Sends an @everyone ping when your event starts.',
    details: ["Take full control of your next in-game event. When you're ready to start, use the token to send an @everyone ping in our Discord and notify the whole server."],
    list: eventOptions, steps: eventSteps('@Everyone'),
  },

  // Punishments
  {
    id: 6862446, cat: 'punishments', name: 'Player Unban', price: 9.99, type: 'single', icon: 'unban', color: '#36e07a',
    short: 'Removes a ban from your account.',
    details: ['Removes a ban from your in-game account.'],
    warning: blacklist('ban'),
  },
  {
    id: 6862450, cat: 'punishments', name: 'Player Unmute', price: 4.99, type: 'single', icon: 'unmute', color: '#ffc83d',
    short: 'Removes a mute from your account.',
    details: ['Removes a mute from your account.'],
    warning: blacklist('mute'),
  },
];

export const faq = [
  { q: 'How do ranks work?', a: 'Ranks and the private practice whitelist are monthly subscriptions. Cancel any time in Tebex.' },
  { q: 'When do I get whitelisted for private practice?', a: 'Automatically, within 5 minutes of buying.' },
  { q: 'How do I use an event token?', a: 'The token is added to your account after you buy. Join the event server, run /event, then /eventcmd redeem. Pick your ping, set up the event and hit Start.' },
  { q: 'Can I buy an unban or unmute?', a: "Not if it was for doxing, DDoSing, swatting or harassment. Those are blacklisted, and buying one anyway won't get you a refund. Not sure? Ask staff in the Discord." },
  { q: 'Something went wrong with my order', a: 'Open a ticket in discord.gg/crystalranked and staff will help you out.' },
];

// Live store currently shows "No Recent Donator" and no recent payments.
// These fill in once the site is connected to Tebex.
export const community = { topDonator: null, recent: [] };
