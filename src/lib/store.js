import { writable } from 'svelte/store';

const caseData = [
    {
        id: 1,
        context: "Exhibit 1 – Opening paragraph of \"Confession\", published 2025.",
        fragment: "\"Forgiveness is not a gift but a transaction. She had learned this in the long silence after the shouting stopped. The weight of unsaid words pressed against her ribs until breathing became a negotiation. She understood then that some debts are never called in, yet they accrue interest in the marrow.\"",
        truth: "AI",
        forensic: "Overuse of abstract nouns (e.g. 'forgiveness', 'silence', 'weight') without an actual meaning. The metaphor 'breathing became a negotiation' appears in multiple public AI training datasets. High possibility of AI participation.",
        narrative: "The case against Elena Clarks begins with a strong evidence, she might not be innocent. "
    },
    {
        id: 2,
        context: "Exhibit 2 – Elena Clark's personal blog, March 31, 2022, 4:00 PM.",
        fragment: "\"I'm taking the boat out this weekend with Marisol. I must say I am tired. I would always prefer the ocean than sitting in front of the desk. Sometimes I think the ocean is the only place that doesn't ask me to be Elena Clark, could I be my sister for a day then? lol.\"",
        truth: "HUMAN",
        forensic: "Use of internet slangs (\"lol\") and the present of personal plans (\"taking the boat out this weekend\"). No AI markers detected.",
        
        narrative: "Elena Clarks seems to be a humorous person."
    },
    {
        id: 3,
        context: "Exhibit 3 – iMessage chat log, April 4, 2022, 9:02 AM.",
        fragment: "Elena: Mom, we're catching the 9:40 bus to the marina, and Marisol packed some sandwiches for us, we'll just eat them on the bus. I'll text you when we're back at about 3pm, love you.\nMother: Tell Marisol to wear a life jacket, she always forgets.\nElena: I'll remind her. ❤️",
        truth: "HUMAN",
        forensic: "Some domestic details and emoji usage that is consistent with Elena's historical messages. Generative models usually struggle to produce such texts.",
        narrative: "Who would bother using AI for daily talks? Things seem normal here."
    },
    {
        id: 4,
        context: "Exhibit 4 – iMessage chat log, April 4, 2022, 9:17 PM.",
        fragment: "Elena: I just got home. Marisol left with a friend so I drove back alone. Today was good, hope you slept well in Brussels.\nMother: (no response; message read at 4:11 AM next day)",
        truth: "HUMAN",
        forensic: "The domestic details are present though accompanying with a slight change in tone..? Variations in tones are usually normal considering Elena Clarks was probably tired. No clear indicator of AI usage.",
        interactiveType: "toggle",
        interactiveContent: {
            buttonLabel: "Check the morning chat",
            reveal: "(Case 3) Elena: Mom, we're catching the 9:40 bus to the marina, and Marisol packed some sandwiches for us, we'll just eat them on the bus. I'll text you when we're back at about 3pm, love you.\nMother: Tell Marisol to wear a life jacket, she always forgets.\nElena: I'll remind her. ❤️"
        },
        narrative: "It's not usual. Elena doesn't usually text her mother after 6 PM, because her parents are all living in Brussels, they would have been asleep."
    },
    {
        id: 5,
        context: "Exhibit 5 – Deleted Facebook post by Dale Rooney, April 5, 8:43 AM.",
        fragment: "\"Okay weird one. Saw the Clark twins heading out on their boat yesterday morning. Elena was wearing that pink swimsuit she always posts in. Cute. Only one came back in the evening. Thought it was Elena at first, obviously, 'cause she's the famous one and they're identical. But she had a dark blue swimsuit on, not the pink one, and she was super out of it. Didn't wave, didn't smile, barely looked at me. I said 'Hey Elena, where's Marisol?' and she just mumbled something about a friend's place. I dunno. Twins, but the outfit swap is kinda strange, right? Hope everything's okay.\"",
        truth: "HUMAN",
        forensic: "Conversational, rich in sensory memory (swimsuit colors, lack of wave). The twin confusion hinges on a concrete discrepancy: the swimsuit change. Elena was seen in pink; the woman who returned wore navy—Marisol's known preference. The post was deleted after a DM from 'EClark_Official' at 9:12 AM urging removal. That account is the same one used to send the AI evening chat.",
        interactiveType: "dm",
        interactiveContent: {
            buttonLabel: "View the deleted DM",
            reveal: "EClark_Official: 'We appreciate your concern, but please take the post down. It is a privacy. '\n\nSent 29 minutes after Dale posted.\n\nThe speed of the response suggests urgency. Marisol wasn't just erasing evidence—she was doing it in real time."
        },
        narrative: "Marisol returned alone, wearing her own swimsuit. She tried to erase the evidence of her mistake."
    },
    {
        id: 6,
        context: "Exhibit 6 – Email from Elena Clark to Bayview Charity, April 5, 2022, 10:14 AM.",
        fragment: "Subject: Regrettable absence. Dear Committee, I must unfortunately decline participation in the April 6th benefit reading. Due to unforeseen personal circumstances, I am unable to fulfill this commitment. I apologize for any inconvenience this may cause. Sincerely, Elena Clark.",
        truth: "AI",
        forensic: "Generic hedging: 'unforeseen personal circumstances'. No specific reason. Stylometric variance of sentence lengths: 2.1 (extremely uniform). Elena Clark had never cancelled a charity event in six years. This email was sent 13 hours after the AI chat to the mother.",
        interactiveType: "timeline",
        interactiveContent: {
            buttonLabel: "View writing timeline",
            reveal: "March 31, 4 PM: Blog post about fishing trip.\nApril 4, 9 AM: Morning chat to mother.\nApril 4, 9 PM: AI-generated message to mother.\nApril 5, 8 AM: Marina witness post.\nApril 5, 10 AM: AI rejection letter.\n\nThis fragment is the last known public human writing by Elena Clark."
        },
        narrative: "The impersonator is systematically erasing Elena's public presence. But they cannot erase the witness."
    },
    {
        id: 7,
        context: "Exhibit 7 – Handwritten note recovered from Elena's study.",
        fragment: "Daily rhythm – Monday to Friday:\nTalk to mom and dad – 9 A.M.\nBreakfast alone\nWrite from 10–1\nWalk at 4\nNo calls after 8.",
        truth: "HUMAN",
        forensic: "Handwriting analysis: 78% match to Marisol Clark's exemplar, not Elena's. The 'd' and 'w' downstrokes are consistent with Marisol's known style. The content is suspicious: Elena never maintained a rigid schedule. This is a performance guide—someone learning to inhabit Elena's life. It is human, but the author is the sister.",
        interactiveType: "toggle",
        interactiveContent: {
            buttonLabel: "Show handwriting comparison overlay",
            reveal: "Key letter discrepancies:\n\nThe 'd' loops are closed (Marisol's trait) vs Elena's open loops.\n\nThe 'w' terminates with an upward hook, found in Marisol's signed statement from 2018.\n\nThe writing is careful, controlled—a deliberate imitation."
        },
        narrative: "Why would Elena need a script to be herself? Unless the person reading this note isn't Elena."
    },
    {
        id: 8,
        context: "Exhibit 8 – Final chapter of \"Confession\", published 2025.",
        fragment: "\"I dream of the ocean every night. In the dream, the water is not blue but grey, and it has hands. I see her face beneath the surface, and I reach for her, but my arms are stone. I wake with salt on my lips, though I am miles from the sea. I wrote this book for her, but she will never read it. That is the confession I cannot make.\"",
        truth: "HUMAN",
        forensic: "This is the only human passage in the novel not written by Elena. Stylometric match: 94% Marisol Clark. The imagery of drowning, guilt, and a silent confession is autobiographical. Marisol poured her truth into the one place she hoped no one would look—inside her sister's book.",
        interactiveType: "reflection",
        interactiveContent: {
            prompt: "Given that this fragment is human but not Elena, would you change your decision criteria? Why?"
        },
        narrative: "The alibi tapes were never about AI. They were about a sister's silence, and the words that broke through it."
    }
];

const groundTruth = ['AI', 'HUMAN', 'HUMAN', 'AI', 'HUMAN', 'AI', 'HUMAN'];

function createGameStore() {
    const { subscribe, set, update } = writable({
        currentView: 'intro',
        currentCase: null,
        cases: {},
        reflection: ''
    });

    return {
        subscribe,
        startGame: () => {
            update(state => ({ ...state, currentView: 'case1', currentCase: 1 }));
        },
        submitGuess: (caseNum, guess) => {
            const correct = groundTruth[caseNum - 1] === guess;
            update(state => ({
                ...state,
                cases: {
                    ...state.cases,
                    [caseNum]: { guess, correct }
                }
            }));
            localStorage.setItem(`case${caseNum}`, JSON.stringify({ guess, correct }));
        },
        setReflection: (text) => {
            update(state => ({ ...state, reflection: text }));
            localStorage.setItem('reflection', text);
        },
        loadFromStorage: () => {
            const cases = {};
            for (let i = 1; i <= 8; i++) {
                const stored = localStorage.getItem(`case${i}`);
                if (stored) {
                    cases[i] = JSON.parse(stored);
                }
            }
            const reflection = localStorage.getItem('reflection') || '';
            update(state => ({ ...state, cases, reflection }));
        },
        goToVerdict: () => {
            update(state => ({ ...state, currentView: 'verdict' }));
        },
        goToResearch: () => {
            update(state => ({ ...state, currentView: 'research' }));
        },
        goBackFromResearch: () => {
            update(state => ({ ...state, currentView: 'intro' }));
        },
        nextCase: (caseNum) => {
            if (caseNum < 8) {
                update(state => ({
                    ...state,
                    currentView: `case${caseNum + 1}`,
                    currentCase: caseNum + 1
                }));
            } else {
                update(state => ({ ...state, currentView: 'verdict' }));
            }
        },
        restart: () => {
            localStorage.clear();
            set({ currentView: 'intro', currentCase: null, cases: {}, reflection: '' });
        }
    };
}

export const gameStore = createGameStore();
export { caseData };